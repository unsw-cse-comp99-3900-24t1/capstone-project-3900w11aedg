import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import morgan from 'morgan';

const app = express();
const port = 3210;

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(bodyParser.json());

morgan.token('body', (req: Request) => JSON.stringify(req.body, null, 2));

const format = ':method :url :status :res[content-length] - :response-time ms\n:body';

app.use(morgan(format));

dotenv.config();

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello, world!');
});

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
export { server };
