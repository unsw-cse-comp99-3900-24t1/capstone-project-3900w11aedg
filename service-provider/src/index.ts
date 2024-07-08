import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'node:fs';
import { requestClaims } from '../../lib/src/service-provider/claim-request-helper.js';
import { loadData } from '../../lib/src/data.js';
import path from 'path';
import { fileURLToPath } from 'url';
import documentLoader from '../../lib/src/issuer/document-loader.js';
import { DataIntegrityProof } from '@digitalbazaar/data-integrity';
import { createVerifyCryptosuite, createDiscloseCryptosuite } from '@digitalbazaar/bbs-2023-cryptosuite';
import * as vc from '@digitalbazaar/vc';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const keyPairURL = path.join(__dirname, 'keyPair.key');
const didURL = path.join(__dirname, 'did.txt');
const port = 3333;

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

morgan.token('body', (req: Request) => JSON.stringify(req.body, null, 2));

const format = ':method :url :status :res[content-length] - :response-time ms\n:body';

app.use(morgan(format));

// const internalUse = {
//   origin: `http://localhost:${port}`,
//   allowedHeaders: 'Content-Type',
// };

app.use(cors());

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello, world!');
});

app.post('/generate/qr-code', async (req: Request, res: Response) => {
  const { claims } = req.body;
  let { domain } = req.body;
  try {
    const { did } = await loadData(didURL, keyPairURL);

    if (!claims) {
      res.status(404).send('No claims found');
      return;
    }

    if (!domain) {
      res.status(404).send('No domain found');
      return;
    } else if (domain === 'localhost') {
      domain += `:${port}`;
    }

    const qrCodeUrl = await requestClaims(domain, claims, did);
    res.status(200).json({ qrCodeUrl });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    let status = 500;
    if (err.message === 'Invalid DID') {
      status = 400;
      return;
    }
    console.log(err);
    res.status(status).send({ err });
  }
});

app.get('/request-claims/:filename', async (req, res) => {
  const { filename } = req.params;
  try {
    const request = fs.readFileSync(__dirname + `/requests/${filename}` + '.json', 'utf-8');
    res.status(200).send(JSON.parse(request));
  } catch (err) {
    res.status(500).send({ err });
  }
});

app.post('/claims/verify', async (req: Request, res: Response) => {
  let { vp_token: token } = req.body;
  // presentation_submission: presentation

  const suite1 = new DataIntegrityProof({
    signer: null,
    date: null,
    cryptosuite: createDiscloseCryptosuite({
      proofId: null,
      selectivePointers: [
        '/credentialSubject'
      ]
    })
  });
  
  const derivedVC = await vc.derive({
    verifiableCredential: token, suite: suite1, documentLoader
  });
  token = derivedVC;

  const suite = new DataIntegrityProof({
    signer: null,
    date: new Date().toDateString(),
    cryptosuite: createVerifyCryptosuite(),
  });
  suite.verificationMethod = token.proof.verificationMethod;

  const result = await vc.verifyCredential({credential: token, suite, documentLoader});
  
  console.log(result)

  if (result.verified) {
    res.status(200).send({ valid: true });
  } else {
    console.log(result.results[0].error);
    res.status(500).send({ valid: false });
  }
});

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
export { server };
