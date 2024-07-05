import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import generateDID from '../../lib/src/generate-did.js';
import dotenv from 'dotenv';
import morgan from 'morgan';
import generateKeyPair from '../../lib/src/key.js';
import { loadData, saveData } from '../../lib/src/data.js';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import { saveQRCode, signCredential, urlToQRCode } from '../../lib/src/issuer/signing.js';
import { fileURLToPath } from 'url';

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

app.post('/generate/did', cors(internalUse), async (_req: Request, res: Response) => {
  const keyPair = await generateKeyPair({ id: 'https://www.unsw.edu.au/' });
  const publicKey = keyPair.publicKey.toString();
  const did = await generateDID(publicKey);
  saveData(didURL, keyPairURL, keyPair, did.id);
  res.status(200).send("DID generated successfully and saved to 'did.txt'");
});

// Metadata URL as QR Code
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.post('/generate/qr-code', cors(internalUse), async (_req: Request, res: Response) => {
  const qrCode = await urlToQRCode(`http://localhost:${port}/.well-known/openid-credential-issuer`);
  await saveQRCode(qrCode, path.join(__dirname, 'metadata.png'));
  res.status(200).send({ qrCode });
});

/**
 * TODO
 */
app.get('/.well-known/openid-credential-issuer', async (_req: Request, res: Response) => {
  console.log('TODO');
  res.status(200).send({});
});

/**
 * TODO
 */
app.post('/authorise', async (req: Request, res: Response) => {
  const { credentialIdentifiers } = req.body;
  console.log('Credential Identifiers:', credentialIdentifiers);
  console.log('TODO');
  const authCode = 'AUTH_CODE';
  res.status(200).send({ authCode });
});

/**
 * TODO
 */
app.post('/token', async (_req: Request, res: Response) => {
  const token = 'TOKEN';
  console.log('TODO');
  res.status(200).send({ token });
});

/**
 * TODO
 */
app.post('/credential/offer', async (req: Request, res: Response) => {
  try {
    const token = req.header('Authorization');
    const { proof } = req.body;

    console.log('Token:', token);
    console.log('Proof:', proof);
    const credential = fs.readFileSync(
      __dirname + '/credentials/' + 'unsigned-credential.json',
      'utf8'
    );
    const { did, keyPair } = await loadData(didURL, keyPairURL);
    const credentialJSON = fs.readFileSync(__dirname + '/credentials/' + credential, 'utf8');
    const signedCredential = await signCredential(credentialJSON, keyPair, did);
    res.status(200).send(signedCredential);
  } catch (error) {
    res.status(400).send(error);
  }
});

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
export { server };
