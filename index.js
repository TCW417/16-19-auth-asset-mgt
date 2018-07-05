'use strict';

require('dotenv').config();

const logger = require('./src/lib/logger');

if (!process.env.NODE_ENV) {
  throw new Error('Undefined NODE_ENV');
}

if (process.env.NODE_ENV !== 'production') {
  logger.log(logger.INFO, 'DEVELOPMENT SETTINGS');
  require('babel-register');
  require('./src/main');
} else {
  logger.log(logger.INFO, 'PRODUCTION SETTINGS');
  require('./build/main'); /*eslint-disable-line*/
}

if (process.argv.includes('-verbose')) {
  logger.log(logger.INFO, 'VERBOSE logger output');
} else {
  console.log('Silent mode');
}

