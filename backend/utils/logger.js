import morgan from 'morgan';
import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, prettyPrint } = format;

const fileRotateTransport = new transports.DailyRotateFile({
  level: 'info',
  filename: 'logs/combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  maxFiles: '14d',
});

export const systemLogs = createLogger({
  level: 'http',
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss.SSS A',
    }),
    prettyPrint()
  ),
  transports: [
    fileRotateTransport,
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
  ],
  exceptionHandlers: [
    new transports.File({
      filename: 'logs/exceptions.log',
    }),
  ],
  rejectionHandlers: [
    new transports.File({
      filename: 'logs/rejections.log',
    }),
  ],
});

// custom morgan middleware for logging requests and responses in JSON format to a file
export const morganMiddleware = morgan(
  function (tokens, req, res) {
    return JSON.stringify({
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: Number.parseFloat(tokens.status(req, res)),
      responseTime: Number.parseFloat(tokens['response-time'](req, res)),
    });
  },
  {
    stream: {
      write: (message) => {
        const data = JSON.parse(message);
        systemLogs.http(`incoming-requests: `, data);
      },
    },
  }
);
