import express, { Request, Response } from 'express';
import cors from 'cors';
import { randomUUID, UUID } from 'crypto';
import { Resolver } from 'did-resolver';
import { getResolver } from 'web-did-resolver';
import QRCode from 'qrcode';
import morgan from 'morgan';
import { generateDID } from '../../libraries/src/generate-did';

const app = express();
const port = 3333;

app.use(express.json());

morgan.token('body', (req: Request) => JSON.stringify(req.body, null, 2));

const format = ':method :url :status :res[content-length] - :response-time ms\n:body';

app.use(morgan(format));

const allowedOrigins = ['http://localhost:3333'];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(options));

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello, world!');
});

app.post('/generate/did', (req: Request, res: Response) => {
  const { did, publicKey } = req.body;
  try {
    const didDoc = generateDID(did, publicKey);
    res.status(200).send(didDoc);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/credential/request', async (req: Request, res: Response) => {
  const { claims, serviceProviderDID } = req.body;

  if (!(await checkValidDID(serviceProviderDID))) {
    res.status(404).send('Service Provider DID not found!');
    return;
  }
  if (!claims || Object.keys(claims).length === 0) {
    res.status(400).send('Invalid parameters');
    return;
  }

  const requestId = randomUUID();
  const serviceProviderURL = `localhost:${port}/credential/present/${requestId}`;

  try {
    const qrCode = await generateQRCode(requestId, claims, serviceProviderDID, serviceProviderURL);
    res.status(200).json({ qrCode });
  } catch (err) {
    res.status(500).send('Could not generate QR code');
  }
});

async function generateQRCode(
  requestId: UUID,
  claims: Record<string, string[]>,
  serviceProviderDID: string,
  serviceProviderURL: string
) {
  const qrData = {
    requestId,
    serviceProviderDID,
    serviceProviderURL,
    claims,
  };

  return await QRCode.toDataURL(JSON.stringify(qrData));
}

async function checkValidDID(did: string) {
  const resolver = new Resolver(getResolver());
  const didDoc = await resolver.resolve(did);
  return didDoc.didResolutionMetadata.error === 'notFound';
}

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
export { server };
