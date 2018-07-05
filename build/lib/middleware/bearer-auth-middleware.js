'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _util = require('util');

var _account = require('../../model/account');

var _account2 = _interopRequireDefault(_account);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jwtVerify = (0, _util.promisify)(_jsonwebtoken2.default.verify);

exports.default = function (request, response, next) {
  _logger2.default.log(_logger2.default.INFO, 'BEARER AUTH token: ' + request.headers.authorization);
  if (!request.headers.authorization) return next(new _httpErrors2.default(400, 'BEARER AUTH MIDDLEWARE: no headers auth'));

  var token = request.headers.authorization.split('Bearer ')[1];
  if (!token) return next(new _httpErrors2.default(400, 'BEARER AUTH MIDDLEWARE: no token'));

  // this will decrypt the token we got from the client side
  return jwtVerify(token, process.env.SECRET).catch(function (error) {
    // we can use a Promise.reject here and this error will skip down to the next catch block in the chain, if there is one
    return Promise.reject(new _httpErrors2.default(401, 'BEARER AUTH - jsonWebToken error ' + JSON.stringify(error)));
  }).then(function (decryptedToken) {
    /*
      decryptedToken = {
        tokenSeed: asdfast45249wa0dfasfdsadfsdf.....
        iat: some date....
      }
    */
    return _account2.default.findOne({ _id: decryptedToken.accountId });
  }).then(function (account) {
    if (!account) return next(new _httpErrors2.default(404, 'BEARER AUTH - no account found'));
    request.account = account;
    return next();
  }).catch(next);
};