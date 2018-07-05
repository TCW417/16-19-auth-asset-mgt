'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _account = require('../model/account');

var _account2 = _interopRequireDefault(_account);

var _basicAuthMiddleware = require('../lib/middleware/basic-auth-middleware');

var _basicAuthMiddleware2 = _interopRequireDefault(_basicAuthMiddleware);

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var authRouter = new _express.Router();

authRouter.post('/api/signup', function (request, response, next) {
  _account2.default.init().then(function () {
    return _account2.default.create(request.body.username, request.body.email, request.body.password);
  }).then(function (account) {
    // we want to get rid of the password as early as possible
    delete request.body.password;
    _logger2.default.log(_logger2.default.INFO, 'AUTH-ROUTER /api/signup: creating token');
    return account.createTokenPromise();
  }).then(function (token) {
    _logger2.default.log(_logger2.default.INFO, 'AUTH-ROUTER /api/signup: returning a 200 code and a token ' + token);
    // what comes back from the above "token" in the then callback is actually an object with a "token" property, i.e. {token: token}, so we use shorthand ES6 object destructuring to grab just the token value itself and send that as JSON to the user
    return response.json({ token: token });
  }).catch(next);
});

authRouter.get('/api/login', _basicAuthMiddleware2.default, function (request, response, next) {
  if (!request.account) return next(new _httpErrors2.default(400, 'AUTH-ROUTER: invalid request'));
  _account2.default.init().then(function () {
    return request.account.createTokenPromise();
  }).then(function (token) {
    _logger2.default.log(_logger2.default.INFO, 'AUTH-ROUTER /api/login - responding with a 200 status code and a token ' + token);
    return response.json({ id: request.account._id, token: token });
  }).catch(next);
  return undefined;
});

exports.default = authRouter;