import express, {Request, Response} from 'express';
import cors from 'cors';
import { UUID, randomUUID } from 'crypto';

const QRCode = require('qrcode');

const app = express();
const port = 3333;

app.use(express.json());

const allowedOrigins = ['http://localhost:3333'];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(options));

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.post('/credential/request', async (req: Request, res: Response) => {
  const { claims, serviceProviderDID } = req.body;
  if (!serviceProviderDID || !claims) {
    res.status(400).send('Invalid parameters');
    return;
  }

  const requestId = randomUUID();
  const serviceProviderURL = `localhost:${port}/credential/present/${requestId}`;

  const qrCode = await generateQRCode(requestId, claims, serviceProviderDID, serviceProviderURL);
  res.status(200).send(qrCode);
});

async function generateQRCode(requestId: UUID, claims: Map<String, Array<String>>, serviceProviderDID: String, serviceProviderURL: String) {
  const qrData = {
    requestId,
    serviceProviderDID,
    serviceProviderURL,
    claims
  };

  return await QRCode.toDataURL(JSON.stringify(qrData));
}