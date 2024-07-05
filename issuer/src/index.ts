import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import generateDID from '../../lib/src/generate-did.js';
import * as vc from '@digitalbazaar/vc';
import { DataIntegrityProof } from '@digitalbazaar/data-integrity';
import { createSignCryptosuite } from '@digitalbazaar/bbs-2023-cryptosuite';
import documentLoader from './document-loader.js';
import dotenv from 'dotenv';

import QRCode from 'qrcode';
import morgan from 'morgan';

const app = express();
const port = 3210;

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(bodyParser.json());

morgan.token('body', (req: Request) => JSON.stringify(req.body, null, 2));

const format = ':method :url :status :res[content-length] - :response-time ms\n:body';

app.use(morgan(format));

dotenv.config();

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello, world!');
});

app.post('/generate/did', async (req: Request, res: Response) => {
  const { publicKey } = req.body;
  try {
    const didDoc = await generateDID(publicKey);
    res.status(200).send({ did: didDoc.id });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Hard coded credential
// const credential: UnsignedCredential = {
//   "@context": [
//     "https://www.w3.org/2018/credentials/v1",
//     "https://www.w3.org/2018/credentials/examples/v1",
//   ],
//   "credentialSubject": {
//     "degree": {
//       "name": "Bachelor of Science and Arts",
//       "type": "BachelorDegree"
//     },
//     "id": "did:web:my.domain"
//   },
//   "id": "urn:uuid:d36986f1-3cc0-4156-b5a4-6d3deab84270",
//   "issuer": "did:web:walt.id",
//   "issuanceDate": "2022-10-07T09:53:41.369917079Z",
//   "type": [
//     "VerifiableCredential",
//     "UniversityDegreeCredential"
//   ]
// };

// const credential2: UnsignedCredential = {
//   "@context": [
//     "https://www.w3.org/2018/credentials/v1",
//     "https://www.w3.org/2018/credentials/examples/v1",
//   ],
//   // omit `id` to enable unlinkable disclosure
//   "type": ["VerifiableCredential", "AlumniCredential"],
//   "issuer": "https://www.unsw.edu.au/",
//   // use less precise date that is shared by a sufficiently large group
//   // of VCs to enable unlinkable disclosure
//   "issuanceDate": "2020-01-01T01:00:00Z",
//   "credentialSubject": {
//     // omit `id` to enable unlinkable disclosure
//     "alumniOf": "University of New South Wales"
//   }
// };

// Issuers should have keys already in real use
// const generateKeyPair = async () => {
//   return await bbs.generateBbsKeyPair({
//     algorithm: 'BBS-BLS12-381-SHA-256',
//   });
// };

// Given a credential and a public/private key pair, returns the signed credential
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const signCredential = async (credential: any, keyPair: { signer: () => string } | undefined) => {
  if (!keyPair) {
    throw new Error('Key pair not found');
  }
  const suite = new DataIntegrityProof({
    signer: keyPair.signer(),
    cryptosuite: createSignCryptosuite({}),
  });

  suite.verificationMethod = 'did:web:walt.id#key-1';

  const signedVC = await vc.issue({
    credential: credential,
    suite: suite,
    documentLoader: documentLoader,
  });

  return JSON.stringify(signedVC);
};

// Given an unsigned credential and issuer keypair, sign the credential
// and return QR code of signed credential
app.post('/issuer/sign-credential', async (req: Request, res: Response) => {
  try {
    const { credential, keyPair } = req.body;
    if (!credential) {
      res.status(404).send('credential not found');
    }

    if (!keyPair) {
      res.status(404).send('Key pair not found');
    }

    const serialisedKeyPair = JSON.parse(keyPair);

    const signedCredential = await signCredential(credential, serialisedKeyPair);
    const qrCode = await QRCode.toDataURL(signedCredential);

    res.json(qrCode);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error issuing credential');
  }
});
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
export { server };
