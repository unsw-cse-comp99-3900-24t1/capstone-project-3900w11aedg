import express, { Request, Response } from 'express';
import cors from 'cors';
import crypto from 'crypto';
import axios from 'axios';
import { DIDDocument } from 'did-resolver';
import bodyParser from 'body-parser';
import morgan from 'morgan';

const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.json());

morgan.token('body', (req: Request) => JSON.stringify(req.body, null, 2));

const format = ':method :url :status :res[content-length] - :response-time ms\n:body';

app.use(morgan(format));

const allowedOrigins = ['http://localhost:3000'];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(options));

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello, world!');
});

app.post('/generate/did', (req: Request, res: Response) => {
  const { did, publicKey } = req.body;
  const didHash = crypto.createHash('sha256');
  didHash.update(did);
  const didHashHex = didHash.digest('hex');
  const didDocument: DIDDocument = {
    '@context': 'https://www.w3.org/ns/did/v1',
    id: `did:web:${didHashHex}`,
    publicKey: [
      {
        id: `did:web:${didHashHex}#key-1`,
        type: 'Ed25519VerificationKey2018',
        controller: `did:example:${didHashHex}`,
        publicKeyBase58: publicKey,
      },
    ],
  };
  try {
    axios.post(`http://localhost:5000/${didHashHex}/.well-known/did.json`, didDocument);
  } catch (error) {
    res.status(500).send('Error saving the did document');
  }

  res.status(200).send(didDocument);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
