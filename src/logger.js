import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config();

const logLevels = {
  debug: 0,
  http: 1,
  info: 2,
  warning: 3,
  error: 4,
  fatal: 5,
};

winston.addColors({
  debug: 'white',
  http: 'green',
  info: 'blue',
  warning: 'yellow',
  error: 'cyan',
  fatal: 'red',
});

const logger = winston.createLogger({
  levels: logLevels,
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console({
      level: process.env.LOG_LEVEL || 'debug',
      format: winston.format.simple(),
    }),
    new winston.transports.File({
      filename: './logs/server-log.log',
      level: 'error',
      format: winston.format.simple(),
    }),
  ],
});

export default logger;