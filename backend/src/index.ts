import express, { Request, Response } from 'express';
import cors from 'cors';
import crypto from 'crypto';
import axios from 'axios';
import { DIDDocument } from 'did-resolver';

const app = express();
const port = 3000;

app.use(cors);
app.use(express.json());

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
    const response = axios.post(
      `http://localhost:5000/.well-known/${didHashHex}/did.json`,
      didDocument
    );
    console.log(response);
  } catch (error) {
    res.status(500).send('Error saving the did document');
  }

  res.status(200).send(didDocument);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
