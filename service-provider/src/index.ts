import express, { Request, Response } from 'express';
import cors from 'cors';
import QRCode from 'qrcode';
import morgan from 'morgan';
import { generateDID } from '../../libraries/src/generate-did';
import fs from 'fs';
import { isValidDID , isValidDomain, isValidClaim } from './helpers/validation-helper';
import { constructRequest } from './helpers/claim-request-helper';

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

app.post('/generate/did', async (req: Request, res: Response) => {
  const { publicKey } = req.body;
  try {
    const didDoc = await generateDID(publicKey);
    res.status(200).send({ did: didDoc.id });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/generate/qr-code', async (req: Request, res: Response) => {
  const { claims, serviceProviderDID } = req.body;
  let { domain } = req.body;

  if (!serviceProviderDID || !(await isValidDID(serviceProviderDID))) {
    res.status(400).send('Invalid Service Provider DID');
    return;
  }
  if (!claims || !isValidClaim(claims) || Object.keys(claims).length === 0) {
    res.status(400).send('Invalid claims');
    return;
  }
  if (!domain || !isValidDomain(domain)) {
    res.status(400).send('Invalid domain');
    return;
  } else if (domain === 'localhost') {
    domain += `:${port}`;
  }

  const presentationRequest = constructRequest(domain, claims, serviceProviderDID);

  const path = __dirname + `/requests`;
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
  fs.writeFileSync(__dirname + `/requests/request-data.json`, JSON.stringify(presentationRequest, null, 2));

  const requestURI = `http://${domain}/request-claims/request-data`;

  try {
    const qrCodeUrl = await QRCode.toDataURL(requestURI);
    res.status(200).json({ qrCodeUrl });
  } catch (err) {
    res.status(500).send('Could not generate QR code');
  }
});

app.get('/request-claims/:filename', async (req, res) => {
  const { filename } = req.params;
  const request = fs.readFileSync(__dirname + `/requests/${filename}` + '.json', 'utf-8');
  if (!request) {
    res.status(404).send('Request not found');
    return;
  }
  res.status(200).send(JSON.parse(request));
});

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
export { server };
