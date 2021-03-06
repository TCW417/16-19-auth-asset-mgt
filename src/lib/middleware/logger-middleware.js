'use strict';

import logger from '../logger';

export default (request, response, next) => {
  logger.log(logger.INFO, `${new Date().toISOString()}: Processing a ${request.method} on ${request.url}`);
  return next();
};
