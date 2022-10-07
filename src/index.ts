import 'dotenv/config';
import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';

// @ts-ignore
import models from './models';
// @ts-ignore
import routes from './routes';

const app = express();

// Application-Level Middleware

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.context = {
    models,
    url: `${req.protocol}://${req.get('host')}`,
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
