
import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import { generateDID } from '../../libraries/src/generate-did';
import { UnsignedCredential } from './types/credential';
//import { Bls12381G2KeyPair } from '@mattrglobal/bls12381-key-pair';
import * as vc from '@digitalbazaar/vc';
import { DataIntegrityProof } from '@digitalbazaar/data-integrity';
import { createSignCryptosuite } from '@digitalbazaar/bbs-2023-cryptosuite';
import * as bls12381Multikey from '@digitalbazaar/bls12-381-multikey';

import QRCode from 'qrcode';
import morgan from 'morgan';

const app = express();
const port = 3210;

app.use(express.json());
app.use(bodyParser.json());

morgan.token('body', (req: Request) => JSON.stringify(req.body, null, 2));

const format = ':method :url :status :res[content-length] - :response-time ms\n:body';

app.use(morgan(format));

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
const credential = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
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

const credential2 = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1"
  ],
  // omit `id` to enable unlinkable disclosure
  "type": ["VerifiableCredential", "AlumniCredential"],
  "issuer": "https://example.edu/issuers/565049",
  // use less precise date that is shared by a sufficiently large group
  // of VCs to enable unlinkable disclosure
  "issuanceDate": new Date("2010-01-01T01:00:00Z"),
  "credentialSubject": {
    // omit `id` to enable unlinkable disclosure
    "alumniOf": "Example University"
  }
};

// Issuers should have keys already in real use
const generateKeyPair = async () => {
  //return await generateBls12381G2KeyPair();
  // const keyPair = await Bls12381G2KeyPair.generate({
  //   id: 'did:example:123#key-1',
  //   controller: 'did:example:123',
  // });
  const keyPair = await bls12381Multikey.generateBbsKeyPair({
    algorithm: 'BBS-BLS12-381-SHA-256',
  });

  return keyPair;
};

// Given a credential and a public/private key pair, returns the signed credential
const signCredential = async (credential: UnsignedCredential, keyPair: any) => {  
  // const suite = {
  //   ...keyPair,
  //   verificationMethod: "did:web:walt.id#key-1", // link to issuer's public key
  // };

  const suite = new DataIntegrityProof({
    signer: keyPair.signer(),
    cryptosuite: createSignCryptosuite({})
  });

  suite.verificationMethod = "did:web:walt.id#key-1";

  const signedVC = await vc.issue({
    credential: credential,
    suite: suite,
  });

  console.log(signedVC);

  return signedVC;
};

// Given an unsigned credential and issuer keypair, sign the credential
// and return QR code of signed credential
app.post('/issuer/sign-credential', async (_req: Request, res: Response) => {
  try {
    //const { keyPair, credential } = req.body; 
    const keyPair = await generateKeyPair();

    if (!keyPair) {
      res.status(404).send('keyPair not found');
    }
    if (!credential) {
      res.status(404).send('credential not found');
    }

    const signedCredential = await signCredential(credential2, keyPair);
    //const qrCode = await QRCode.toDataURL(JSON.stringify(signedCredential));

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
