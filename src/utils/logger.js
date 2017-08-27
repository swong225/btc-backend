const winston = require('winston');
require('winston-daily-rotate-file');

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.DailyRotateFile)({
      filename: './logs/backend.log',
      datePattern: 'yyyy-MM-dd.',
      prepend: true,
      maxsize: 10000000,
      prettyprint: true
    }),
    new (winston.transports.File)({
      filename: './logs/info.log',
      prettyprint: true
    }),
    new (winston.transports.Console)()
  ]
});

module.exports = logger;
