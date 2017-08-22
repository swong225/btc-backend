const winston = require('winston');

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({ filename: './logs/info.log' })
  ]
});

module.exports = logger;
