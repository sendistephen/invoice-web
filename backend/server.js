import chalk from 'chalk';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import { morganMiddleware, systemLogs } from './utils/logger.js';

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// allow passing incoming requests with json payload
app.use(express.json());
// pass incoming request with url encoded payload -> extended means we can not use a nested object.
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morganMiddleware);
// root route
app.get('/api/v1', (req, res) => {
  res.json({ message: 'Welcome to invoice app!' });
});

const PORT = process.env.PORT || 1993;

app.listen(PORT, () => {
  console.log(
    `${chalk.green.bold('✔')} 👍 Server running in ${chalk.yellow.bold(
      process.env.NODE_ENV
    )} mode on port ${chalk.blue.bold(PORT)}`
  );
  systemLogs.info(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
