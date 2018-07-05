'use strict';

var winston = require('winston');

if (process.argv.includes('-verbose') || process.env.NODE_ENV !== 'production') {
  var logger = module.exports = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [new winston.transports.File({ filename: new Date().toDateString().replace(/ /g, '-') + '.log', level: 'verbose' }), new winston.transports.Console({ format: winston.format.simple(), level: 'info' })]
  });
  logger.INFO = 'info';
  logger.ERROR = 'error';
} else {
  var _logger = module.exports = {};
  _logger.INFO = 'info';
  _logger.ERROR = 'error';
  _logger.log = function () {};
}