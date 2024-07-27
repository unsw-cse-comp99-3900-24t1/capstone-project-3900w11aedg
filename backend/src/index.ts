import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import uploadDIDDocument from '../../lib/src/upload-did-document.js';
import generateKeyPair from '../../lib/src/key.js';
import { loadData, saveData } from '../../lib/src/data.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { deriveAndCreatePresentation } from '../../lib/src/backend/presentations.js';
import axios from 'axios';
import { getProjectRoot } from '../../lib/src/find.js';
import base64url from 'base64-url';
import { areValidCredentials, isValidUrl } from '../../lib/src/validation-helper.js';
import { DIDDocument } from 'did-resolver';

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);
const __basedir = getProjectRoot(__dirname);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(<any>global)['__basedir'] = __basedir;
const keyPairURL = path.join(__basedir, 'keyPair.key');
const didURL = path.join(__basedir, 'did.txt');

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

morgan.token('body', (req: Request) => JSON.stringify(req.body, null, 2));

const format = ':method :url :status :res[content-length] - :response-time ms\n:body';

app.use(morgan(format));

const internalUse = {
  origin: ['http://localhost:8081', 'http://10.0.2.2:8081', 'http://127.0.0.1:8081'],
  allowedHeaders: 'Content-Type',
};

app.use(cors());

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello, world!');
});

app.post('/generate/did', cors(internalUse), async (_req: Request, res: Response) => {
  try {
    const { keyPair, did, didDocument } = await generateKeyPair();
    await uploadDIDDocument(didDocument as DIDDocument, did);
    saveData(didURL, keyPairURL, keyPair, did);
    res.status(200).send({ did });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/presentation/create', cors(internalUse), async (req: Request, res: Response) => {
  const { credentials, serviceProviderUrl, claimsToKeep } = req.body;
  if (!credentials || !serviceProviderUrl) {
    res.status(400).send('Missing credentials or service provider URL');
    return;
  } else if (!areValidCredentials(credentials) || !isValidUrl(serviceProviderUrl)) {
    res.status(400).send('Invalid credentials format or URL');
    return;
  }

  if (claimsToKeep && (!Array.isArray(claimsToKeep) || claimsToKeep.length == 0)) {
    res.status(400).send('Invalid claims to keep format');
    return;
  }

  try {
    const presentation = await deriveAndCreatePresentation(credentials, claimsToKeep);
    const vp_token = base64url.encode(JSON.stringify(presentation));
    const outcome = await axios.post(serviceProviderUrl, { vp_token });
    if (outcome.status === 200) {
      res.status(200).send({ verified: true });
    } else if (outcome.status === 400) {
      res.status(400).send({ verified: false });
    } else {
      res.status(500).send('Error sending presentation to service provider');
    }
  } catch (err) {
    res.status(500).send('Error deriving and creating presentation: ' + err);
  }
});

// Retrieves a specific issuer's metadata given the endpoint
app.post('/issuer/poll', cors(internalUse), async (req: Request, res: Response) => {
  const { issuerUrl } = req.body;

  if (!issuerUrl) {
    res.status(400).send('Must provide target Issuer\'s URL');
    return;
  }

  try {
    const response = await axios.get(issuerUrl);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .send(`Error fetching issuer metadata at ${issuerUrl}`);
    return;
  }
});

// Requests the credential selected from the options returned by /issuer/poll
app.post('/credential/request', cors(internalUse), async (req: Request, res: Response) => {
  const {
    credential_identifier: credentialIdentifier,
    authorization_endpoint: authorizationEndpoint,
    credential_endpoint: credentialEndpoint,
  } = req.body;

  if (!credentialIdentifier || !authorizationEndpoint || !credentialEndpoint) {
    res.status(400).send('Missing credential identifier, authorization endpoint, or credential endpoint');
    return;
  }

  const { did } = await loadData(didURL, keyPairURL);

  const authorizationRequest = {
    response_type: 'code',
    client_id: did,
    authorization_details: {
      type: 'openid_credential',
      credential_configuration_id: credentialIdentifier,
    },
  };

  let auth_code: string;
  try {
    const response = await axios.post(authorizationEndpoint, authorizationRequest);
    auth_code = response.data.code;
  } catch (error) {
    res.status(500).send(`Error authorising credential request at ${authorizationEndpoint}`);
    return;
  }

  const credentialRequest = {
    auth_code: auth_code,
    credential_identifier: credentialIdentifier,
  };

  try {
    const response = await axios.post(credentialEndpoint, credentialRequest);
    const signedCredential = response.data.credential;
    res.status(200).json(signedCredential);
  } catch (error) {
    res.status(500).send(`Error receiving credential request at ${credentialEndpoint}`);
  }
});


const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
export { server };