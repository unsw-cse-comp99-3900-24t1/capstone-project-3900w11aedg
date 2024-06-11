import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
