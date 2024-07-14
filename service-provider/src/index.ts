import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'node:fs';
import { verifyClaim } from '../../lib/src/service-provider/claim-verify-helper.js';

const app = express();
const port = 3333;

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

app.post('/claims/verify', async (req: Request, res: Response) => {
  const { vp_token: token } = req.body;
  if (!token) {
    res.status(404).send('No token found');
    return;
  }

  const result = await verifyClaim(token, true);
  console.log(result.error);
  if (result.verified) {
    res.status(200).send({ valid: true });
  } else {
    res.status(500).send({ valid: false });
  }
});

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
export { server };
