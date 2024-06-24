
import express, {Request, Response} from 'express';
import {
  generateBls12381G2KeyPair,
  blsSign,
  BlsKeyPair,
} from "@mattrglobal/bbs-signatures";
import bodyParser from 'body-parser';
import { generateDID } from '../../libraries/src/generate-did';
import { UnsignedCredential, VerifiableCredential } from '../../libraries/src/credential-class';
import { documentLoader } from '@digitalbazaar/vc';
import * as vc from '@digitalbazaar/vc';
import { BbsBlsSignature2020, BbsBlsSignatureProof2020 } from '@mattrglobal/jsonld-signatures-bbs';
import { Bls12381G2KeyPair } from '@mattrglobal/bls12381-key-pair';
import * as jsonld from 'jsonld';
import { encode } from 'base58-universal';

const QRCode = require('qrcode');

const app = express();
const port = 3210;

app.use(express.json());
app.use(bodyParser.json());

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello, world!');
});

app.post('/generate/did', (req: Request, res: Response) => {
  const { publicKey } = req.body;
  try {
    const didDoc = generateDID(publicKey);
    res.status(200).send(didDoc);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Hard coded credential
const ucredential: UnsignedCredential = {
  "@context": [
    "https://www.w3.org/ns/did/v1"
  ],
  "credentialSubject": {
    "degree": {
      "name": "Bachelor of Science and Arts",
      "type": "BachelorDegree"
    },
    "id": "did:web:my.domain"
  },
  "id": "urn:uuid:d36986f1-3cc0-4156-b5a4-6d3deab84270",
  "issuer": "did:web:walt.id",
  "issuanceDate": "2022-10-07T09:53:41.369917079Z",
  "type": [
    "VerifiableCredential",
    "UniversityDegreeCredential"
  ],
  // "proof": {
  //   "type": "BbsBlsSignature2020",
  //   "created": "2022-10-07T09:53:41Z",
  //   "proofPurpose": "assertionMethod",
  //   "verificationMethod": "did:web:walt.id#key-1",
  //   "jws": ""
  // }
};

const proof = {
  "type": "BbsBlsSignature2020",
  "created": "2022-10-07T09:53:41Z",
  "proofPurpose": "assertionMethod",
  "verificationMethod": "did:web:walt.id#key-1",
  "jws": ""
};

// Issuers should have keys already in real use
const generateKeyPair = async () => {
  return await generateBls12381G2KeyPair();
};

// Given a credential and a public/private key pair, returns the signed credential
const signCredential = async (credential: UnsignedCredential, keyPair: BlsKeyPair) => {  
  const suite = new BbsBlsSignature2020({
    key: new Bls12381G2KeyPair({ publicKeyBase58: encode(keyPair.publicKey) }),
  });

  const signedVC = await vc.issue({
    credential,
    suite,
    documentLoader,
  });
  
  return signedVC;
};

// Given an unsigned credential and issuer keypair, sign the credential 
// and return QR code of signed credential
app.post('/issuer/sign-credential', async (req: Request, res: Response) => {
  try {
    const { keyPair, credential } = req.body; 
    if (!keyPair) {
      res.status(404).send("keyPair not found");
    }
    if (!credential) {
      res.status(404).send("credential not found");
    }

    const signedCredential = await signCredential(credential, keyPair);
    const qrCode = await QRCode.toDataURL(JSON.stringify(signedCredential));

    res.json({ qrCode });
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