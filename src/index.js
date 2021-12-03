import 'dotenv/config';
import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';

import models from './models';
import routes from './routes';
import { generate } from './scripts/generate';

const app = express();

// Application-Level Middleware

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.context = {
    models,
  };
  next();
});

// Routes

app.use('/chord', routes.chord);
app.use('/scale', routes.scale);
app.use('/interval', routes.interval);

// Start

app.listen(process.env.PORT, () =>
  console.log(`Example app listenin on port ${process.env.PORT}!`),
);
