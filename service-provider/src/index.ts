import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import { verifyDocument } from '../../lib/src/service-provider/verification.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { getProjectRoot } from '../../lib/src/find.js';
import fs from 'fs';
import { decodeToken } from '../../lib/src/validation-helper.js';

const app = express();
const port = 3333;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __basedir = getProjectRoot(__dirname);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(<any>global)['__basedir'] = __basedir;

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
    const request = fs.readFileSync(__basedir + `/requests/${filename}` + '.json', 'utf-8');
    res.status(200).send(JSON.parse(request));
  } catch (err) {
    res.status(500).send({ err });
  }
});

app.post('/presentation/verify', async (req: Request, res: Response) => {
  const { vp_token } = req.body;
  const presentation = decodeToken(vp_token);
  if (!vp_token || !presentation) {
    res.status(400).send('Missing or invalid token');
    return;
  }

  try {
    const result = await verifyDocument(presentation, true);
    if (result.verified) {
      res.status(200).send({ verified: true });
    } else {
      res.status(400).send({ verified: false });
    }
  } catch (err) {
    res.status(500).send({ verified: false, err });
  }
});

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
export { server };