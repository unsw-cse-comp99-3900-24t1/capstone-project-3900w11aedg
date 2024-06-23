
import express, {Request, Response} from 'express';
import {
  generateBls12381G2KeyPair,
  blsSign,
  BlsKeyPair,
} from "@mattrglobal/bbs-signatures";
import bodyParser from 'body-parser';

const app = express();
const port = 3210;

app.use(express.json());
app.use(bodyParser.json());

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello, world!');
});

// Hard coded credential
const credential = {
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
  "issued": "2022-10-07T09:53:41.369913097Z",
  "issuer": {
    "id": "did:web:walt.id"
  },
  "issuanceDate": "2022-10-07T09:53:41.369917079Z",
  "type": [
    "VerifiableCredential",
    "UniversityDegreeCredential"
  ],
  "proof": {
    "type": "BbsBlsSignature2020",
    "created": "2022-10-07T09:53:41Z",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "did:web:walt.id#key-1",
    "jws": ""
  }
};

// Issuers should have keys already in real use
const generateKeyPair = async () => {
  return await generateBls12381G2KeyPair();
};

// Given a credential and a public/private key pair, returns the signed credential
const signCredential = async (credential: { proof: { jws: string; }; }, keyPair: BlsKeyPair) => {
  const encodedCredential = new TextEncoder().encode(JSON.stringify(credential));
  const signature = await blsSign({
    keyPair: keyPair,
    messages: [encodedCredential],
  });
  
  credential.proof.jws = Buffer.from(signature).toString('base64');
  return credential;
};

app.post('/issuer/sign-credential', async (_req: Request, res: Response) => {
  try {
    const keyPair = await generateKeyPair(); // Issuers should have one keypair later on, no generation
    const signedCredential = await signCredential(credential, keyPair);
    res.json(signedCredential);
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