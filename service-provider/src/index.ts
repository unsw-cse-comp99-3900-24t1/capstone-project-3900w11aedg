import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'node:fs';
import { verify } from '../../lib/src/service-provider/verification.js';
import base64url from 'base64-url';
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();
const port = 3333;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

morgan.token('body', (req: Request) => JSON.stringify(req.body, null, 2));

const format = ':method :url :status :res[content-length] - :response-time ms\n:body';

app.use(morgan(format));

app.use(cors());

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello, world!');
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

app.post('/presentation/verify', async (req: Request, res: Response) => {
  const { vp_token } = req.body;
  if (!vp_token) {
    res.status(400).send('No token found');
    return;
  }

  try {
    const result = await verify(JSON.parse(base64url.decode(vp_token)), true);

    if (result.verified) {
      res.status(200).send({ valid: true });
    } else {
      console.log(result.error);
      res.status(500).send({ valid: false });
    }
  } catch (err) {
    res.status(500).send({ valid: false, err });
  }
});

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
export { server };
