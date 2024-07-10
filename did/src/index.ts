import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import { DIDDocument } from 'did-resolver';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 5000;

morgan.token('body', (req: Request) => JSON.stringify(req.body, null, 2));

const format = ':method :url :status :res[content-length] - :response-time ms\n:body';

app.use(morgan(format));

app.use(express.json());
app.use(bodyParser.json());

const allowedOrigins = ['http://localhost:5000, http://localhost:3000'];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(options));

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello, world!');
});

app.post('/.well-known/:id/did.json', (req: Request, res: Response) => {
  const didDocument = req.body;
  const { id } = req.params;
  if (!id) {
    res.status(400).send('Invalid DID');
    return;
  }
  const path = __dirname + `/.well-known/${id}`;
  try {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
    fs.writeFileSync(
      __dirname + `/.well-known/${id}/did.json`,
      JSON.stringify(didDocument, null, 2)
    );
    res.status(200).send({ message: 'DID Document saved successfully' });
  } catch (err) {
    res.status(500).send({ err });
  }
});

app.get('/.well-known/:id/did.json', (req: Request, res: Response) => {
  const { id } = req.params;
  const didDocument = fs.readFileSync(__dirname + `/.well-known/${id}/did.json`, 'utf-8');
  if (!didDocument) {
    res.status(404).send('DID Document not found');
    return;
  }
  const parsed = JSON.parse(didDocument) as DIDDocument;
  res.status(200).send(parsed);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
