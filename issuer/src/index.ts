import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { loadData } from '../../lib/src/data.js';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import { signCredential } from '../../lib/src/issuer/signing.js';
import { fileURLToPath } from 'url';
import { saveQRCode, urlToQRCode } from '../../lib/src/qr.js';
import { v4 as uuidv4 } from 'uuid';
import issuerMetadata from './meta-data.json' assert { type: 'json' };

const app = express();
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);
const keyPairURL = path.join(__dirname, 'keyPair.key');
const didURL = path.join(__dirname, 'did.txt');
const port = 3210;

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(bodyParser.json());

morgan.token('body', (req: Request) => JSON.stringify(req.body, null, 2));

const format = ':method :url :status :res[content-length] - :response-time ms\n:body';

app.use(morgan(format));

const internalUse = {
  origin: `http://localhost:${port}`,
  allowedHeaders: 'Content-Type',
};

dotenv.config();
app.use(cors());

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello, world!');
});

// Metadata URL as QR Code
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.post('/generate/qr-code', cors(internalUse), async (_req: Request, res: Response) => {
  const qrCode = await urlToQRCode(`http://localhost:${port}/.well-known/openid-credential-issuer`);
  await saveQRCode(qrCode, path.join(__dirname, 'metadata.png'));
  res.status(200).send({ qrCode });
});

// Returns the Issuer's metadata
app.get('/.well-known/openid-credential-issuer', async (_req: Request, res: Response) => {
  res.json({ credential_offer: issuerMetadata });
});

// const authorization_request = { 
//   response_type: "code",  // must always be set to code
//   client_id: "did:example:123456789abcdefghi",  // real client_id requires prior registration with issuer
//   authorization_details: {
//     type: "openid_credential",
//     credential_configuration_id: "UniversityDegree_LDP_VC",
//   }
// };

const authorizationStore: { [key: string]: { 
    client_id: string, 
    authorization_details: {
      type: string,
      credential_configuration_id: string,
    }, 
} } = {}; // In-memory store for authorization codes for now, no backend database

// Returns an authorisation token, given requester client and wanted credential
app.post('/authorise', async (req: Request, res: Response) => {
  const { response_type, client_id, authorization_details } = req.body;
  
  if (!response_type || response_type !== 'code') {
    res.status(400).send('Response type must be "code"');
    return;
  }

  if (!client_id) {
    res.status(400).send('Client identifier must be provided');
    return;
  }
  
  if (!authorization_details) {
    res.status(400).send('Authorisation details must be provided');
    return;
  }

  const authCode = uuidv4();

  authorizationStore[authCode] = { 
    client_id: client_id, 
    authorization_details: authorization_details, 
  };

  res.status(200).send({ code: authCode });
});

// const credential_request = {
//   auth_code: "ACCESSTOKEN",
//   credential_identifier: "UniversityDegree_LDP_VC",
// }

// Issues the requested credential to the Identity Owner 
app.post('/credential/offer', async (req: Request, res: Response) => {
  try {
    const { auth_code, credential_identifier } = req.body;

    if (!auth_code) {
      res.status(400).send('Authorization token is required');
      return;
    }

    const authDetails = authorizationStore[auth_code];
    if (!authDetails) {
      res.status(400).send('Authorization token is invalid');
      return;
    }

    if (authDetails['authorization_details']['credential_configuration_id'] !== credential_identifier) {
      res.status(400).send('Credential requested does not match the authorised credential');
      return;
    }

    delete authorizationStore[auth_code];

    const signedCredential = await _signCredential(credential_identifier);
    res.status(200).send({ credential: signedCredential });
  } catch (error) {
    res.status(400).send(error);
  }
});

async function _signCredential(credential_identifier: string) {
  const credential = fs.readFileSync(
    __dirname + '/credentials/' + credential_identifier + '.json',
    'utf8'
  );
  const credentialJSON = JSON.parse(credential);
  const { keyPair } = await loadData(didURL, keyPairURL);

  return await signCredential(credentialJSON, keyPair);
}

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
export { server };
