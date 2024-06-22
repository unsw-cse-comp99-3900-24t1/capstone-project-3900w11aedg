import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import { DIDDocument } from 'did-resolver';

const app = express();
const port = 5000;

app.use(cors);
app.use(express.json());

const allowedOrigins = ['http://localhost:5000'];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(options));

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello, world!');
});

app.post('/.well-known/:id/did.json', (req: Request, res: Response) => {
  // Save the did document to the database
  const didDocument = req.body;
  console.log(didDocument);
  const { id } = req.params;
  if (!id) {
    res.status(400).send('Invalid DID');
    return;
  }

  fs.writeFileSync(__dirname + `/.well-known/${id}/did.json`, JSON.stringify(didDocument, null, 2));
  res.status(200).send({ message: 'DID Document saved successfully' });
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
