'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _express = require('express');

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _profile = require('../model/profile');

var _profile2 = _interopRequireDefault(_profile);

var _bearerAuthMiddleware = require('../lib/middleware/bearer-auth-middleware');

var _bearerAuthMiddleware2 = _interopRequireDefault(_bearerAuthMiddleware);

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var profileRouter = new _express.Router();

// the whole point of passing in bearerAuthMiddleware is to attach a user's account to the request object. If we get that far, we know this user is authorized to do CRUD operations on a profile that maps back to their account, therefore we can attach a required accountId onto the Profile instance because the bearerAuthMiddleware process gave us an account to access 

profileRouter.post('/api/profiles', _bearerAuthMiddleware2.default, function (request, response, next) {
  if (!request.account) return next(new _httpErrors2.default(400, 'POST PROFILE_ROUTER: invalid request'));
  _profile2.default.init().then(function () {
    return new _profile2.default(_extends({}, request.body, { // this is an ES6 object rest-spread operator that makes a shallow copy of an object
      accountId: request.account._id
    })).save();
  }).then(function (profile) {
    _logger2.default.log(_logger2.default.INFO, 'POST PROFILE ROUTER: new profile created with 200 code, ' + JSON.stringify(profile._id));
    return response.json(profile);
  }).catch(next);
  return undefined;
});

profileRouter.get('/api/profiles', _bearerAuthMiddleware2.default, function (request, response, next) {
  if (!request.account) return next(new _httpErrors2.default(400, 'GET PROFILE ROUTER: invalid request'));
  if (!Object.keys(request.query).length === 0) {
    return _profile2.default.find().populate().then(function (profiles) {
      return response.json(profiles);
    }).catch(next);
  }

  if (!request.query.id) return next(new _httpErrors2.default(400, 'GET PROFILE ROUTER: bad query'));

  _profile2.default.findOne({ _id: request.query.id }).then(function (profile) {
    if (!profile) return next(new _httpErrors2.default(400, 'PROFILE ROUTER GET: profile not found'));
    return response.json(profile);
  }).catch(next);
  return undefined;
});

exports.default = profileRouter;