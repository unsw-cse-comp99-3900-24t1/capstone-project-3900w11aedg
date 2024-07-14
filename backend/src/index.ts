import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import generateDID from '../../lib/src/generate-did.js';
import generateKeyPair from '../../lib/src/key.js';
import { saveData, loadData } from '../../lib/src/data.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { createPresentation, deriveCredential } from '../../lib/src/backend/presentations.js';
import axios from 'axios';

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);
const keyPairURL = path.join(__dirname, 'keyPair.key');
const didURL = path.join(__dirname, 'did.txt');

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

morgan.token('body', (req: Request) => JSON.stringify(req.body, null, 2));

const format = ':method :url :status :res[content-length] - :response-time ms\n:body';

app.use(morgan(format));

const internalUse = {
  origin: `http://localhost:${port}`,
  allowedHeaders: 'Content-Type',
};

app.use(cors());

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello, world!');
});

app.post('/generate/did', cors(internalUse), async (_req: Request, res: Response) => {
  try {
    const { keyPair, did, didDocument } = await generateKeyPair();
    await generateDID(didDocument, did);
    saveData(didURL, keyPairURL, keyPair, did);
    res.status(200).send("DID generated successfully and saved to 'did.txt'");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/create/presentation', async (req: Request, res: Response) => {
  const { claim, serviceProviderUrl } = req.body;
  if (!claim || !serviceProviderUrl) {
    res.status(400).send('Missing claim or service provider URL');
  }

  const promises = claim.map(async (credential: object) => await deriveCredential(credential));
  const derivedCredentials = await Promise.all(promises);

  const { keyPair } = await loadData(didURL, keyPairURL);
  const presentation = await createPresentation(derivedCredentials, keyPair);

  try {
    await axios.post(serviceProviderUrl, { vp_token: presentation });
    res.status(200).send('Presentation sent successfully.');
  } catch (error) {
    res.status(500).send('Error sending presentation: ' + error);
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
    const response = await axios.get(`${issuerUrl}/.well-known/openid-credential-issuer`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).send(`Error fetching issuer metadata at ${issuerUrl}/.well-known/openid-credential-issuer`);
    return
  }
});

// Requests the credential selected from the options returned by /issuer/poll 
app.post('/credential/request', cors(internalUse), async (req: Request, res: Response) => {
  const { credential_identifier, authorization_endpoint, credential_endpoint } = req.body;

  const { did } = await loadData(didURL, keyPairURL);

  const authorization_request = { 
    response_type: "code",
    client_id: did,
    authorization_details: {
      type: "openid_credential",
      credential_configuration_id: credential_identifier,
    }
  };

  let auth_code: string;
  try {
    const response = await axios.post(authorization_endpoint, authorization_request);
    auth_code = response.data.code;
  } catch (error) {
    res.status(500).send(`Error authorising credential request at ${authorization_endpoint}`);
    return;
  }

  const credential_request = {
    auth_code: auth_code,
    credential_identifier: credential_identifier,
  }

  try {
    const response = await axios.post(credential_endpoint, credential_request);
    const signedCredential = response.data.credential;
    res.status(200).json(signedCredential);
  } catch (error) {
    res.status(500).send(`Error authorising credential request at ${authorization_endpoint}`);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
