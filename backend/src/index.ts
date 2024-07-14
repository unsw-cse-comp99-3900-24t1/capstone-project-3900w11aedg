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

/**
 * TODO
 */
app.post('/credential/request', cors(internalUse), async (_req: Request, res: Response) => {
  res.status(200).send('Request received');
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

  const derivedCredentials = [];
  for (const credential of claim) {
    derivedCredentials.push(await deriveCredential(credential));
  }

  const { keyPair } = await loadData(didURL, keyPairURL);
  const presentation = await createPresentation(derivedCredentials, keyPair);

  try {
    await axios.post(serviceProviderUrl, presentation);
  } catch (error) {
    res.status(500).send('Error sending presentation: ' + error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
