'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _superagentAuthBearer = require('superagent-auth-bearer');

var _superagentAuthBearer2 = _interopRequireDefault(_superagentAuthBearer);

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _server = require('../lib/server');

var _accountMock = require('./lib/account-mock');

var _profileMock = require('./lib/profile-mock');

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

(0, _superagentAuthBearer2.default)(_superagent2.default);

var apiUrl = 'http://localhost:' + process.env.PORT + '/api';

describe('TESTING ROUTER PROFILE', function () {
  var mockData = void 0;
  var token = void 0;
  var account = void 0;
  beforeAll(_server.startServer);
  afterAll(_server.stopServer);
  beforeEach(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _profileMock.removeAllResources)();

          case 2:
            _context.prev = 2;
            _context.next = 5;
            return (0, _accountMock.createAccountMockPromise)();

          case 5:
            mockData = _context.sent;

            account = mockData.account; /*eslint-disable-line*/
            token = mockData.token; /*eslint-disable-line*/
            _context.next = 13;
            break;

          case 10:
            _context.prev = 10;
            _context.t0 = _context['catch'](2);
            return _context.abrupt('return', _logger2.default.log(_logger2.default.ERROR, 'Unexpected error in profile-router beforeEach: ' + _context.t0));

          case 13:
            return _context.abrupt('return', undefined);

          case 14:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[2, 10]]);
  })));

  describe('POST PROFILE ROUTES TESTING', function () {
    test('POST 200 to /api/profiles for successful profile creation', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var mockProfile, response;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              mockProfile = {
                bio: _faker2.default.lorem.words(20),
                location: _faker2.default.address.city(),
                firstName: _faker2.default.name.firstName(),
                lastName: _faker2.default.name.lastName()
              };
              response = void 0;
              _context2.prev = 2;
              _context2.next = 5;
              return _superagent2.default.post(apiUrl + '/profiles').authBearer(token).send(mockProfile);

            case 5:
              response = _context2.sent;
              _context2.next = 11;
              break;

            case 8:
              _context2.prev = 8;
              _context2.t0 = _context2['catch'](2);

              expect(_context2.t0).toEqual('POST 200 test that should pass');

            case 11:
              expect(response.status).toEqual(200);
              expect(response.body.accountId).toEqual(account._id.toString());
              expect(response.body.firstName).toEqual(mockProfile.firstName);
              expect(response.body.lastName).toEqual(mockProfile.lastName);
              expect(response.body.bio).toEqual(mockProfile.bio);
              expect(response.body.location).toEqual(mockProfile.location);

            case 17:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined, [[2, 8]]);
    })));

    test('POST 400 for trying to post a profile with a bad token', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      var response;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return _superagent2.default.post(apiUrl + '/profiles').set('Authorization', 'Bearer THISABADTOKEN');

            case 3:
              response = _context3.sent;

              expect(response).toEqual('POST 400 in try block. Shouldn\'t be executed.');
              _context3.next = 10;
              break;

            case 7:
              _context3.prev = 7;
              _context3.t0 = _context3['catch'](0);

              expect(_context3.t0.status).toEqual(401);

            case 10:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined, [[0, 7]]);
    })));

    test('POST 400 to /api/profiles for missing required firstName', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
      var mockProfile, response;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              mockProfile = {
                bio: _faker2.default.lorem.words(20),
                location: _faker2.default.address.city(),
                // firstName: faker.name.firstName(),
                lastName: _faker2.default.name.lastName()
              };
              _context4.prev = 1;
              _context4.next = 4;
              return _superagent2.default.post(apiUrl + '/profiles').authBearer(token).send(mockProfile);

            case 4:
              response = _context4.sent;

              expect(response.status).toEqual('ignored, should not reach this code.');
              _context4.next = 11;
              break;

            case 8:
              _context4.prev = 8;
              _context4.t0 = _context4['catch'](1);

              expect(_context4.t0.status).toEqual(400);

            case 11:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, undefined, [[1, 8]]);
    })));
  });

  describe('GET PROFILES ROUTE TESTING', function () {
    test('GET 200 on successfull profile retrieval', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
      var mockProfileData, response;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              mockProfileData = void 0;
              _context5.prev = 1;
              _context5.next = 4;
              return (0, _profileMock.createProfileMockPromise)();

            case 4:
              mockProfileData = _context5.sent;
              _context5.next = 10;
              break;

            case 7:
              _context5.prev = 7;
              _context5.t0 = _context5['catch'](1);
              throw _context5.t0;

            case 10:
              response = void 0;
              _context5.prev = 11;
              _context5.next = 14;
              return _superagent2.default.get(apiUrl + '/profiles').query({ id: mockProfileData.profile._id.toString() }).authBearer(token);

            case 14:
              response = _context5.sent;
              _context5.next = 20;
              break;

            case 17:
              _context5.prev = 17;
              _context5.t1 = _context5['catch'](11);

              expect(_context5.t1.status).toEqual('GET that should work.');

            case 20:
              expect(response.status).toEqual(200);
              expect(response.body.firstName).toEqual(mockProfileData.profile.firstName);
              expect(response.body.accountId).toEqual(mockProfileData.profile.accountId.toString());

            case 23:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, undefined, [[1, 7], [11, 17]]);
    })));

    test('GET 404 on profile accountId not found', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
      var profile, response;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              profile = void 0;
              _context6.prev = 1;
              _context6.next = 4;
              return (0, _profileMock.createProfileMockPromise)();

            case 4:
              profile = _context6.sent;
              _context6.next = 10;
              break;

            case 7:
              _context6.prev = 7;
              _context6.t0 = _context6['catch'](1);
              throw _context6.t0;

            case 10:
              profile.accountId = '1234567890';
              response = void 0;
              _context6.prev = 12;
              _context6.next = 15;
              return _superagent2.default.get(apiUrl + '/profiles').query({ id: profile.accountId }).authBearer(token);

            case 15:
              response = _context6.sent;

              expect(response.status).toEqual('We should not reach this code GET 404');
              _context6.next = 22;
              break;

            case 19:
              _context6.prev = 19;
              _context6.t1 = _context6['catch'](12);

              expect(_context6.t1.status).toEqual(404);

            case 22:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, undefined, [[1, 7], [12, 19]]);
    })));

    test('GET 401 on bad token', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
      var profile, response;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              profile = void 0;
              _context7.prev = 1;
              _context7.next = 4;
              return (0, _profileMock.createProfileMockPromise)();

            case 4:
              profile = _context7.sent;
              _context7.next = 10;
              break;

            case 7:
              _context7.prev = 7;
              _context7.t0 = _context7['catch'](1);
              throw _context7.t0;

            case 10:
              response = void 0;
              _context7.prev = 11;
              _context7.next = 14;
              return _superagent2.default.get(apiUrl + '/profiles').query({ id: profile.accountId }).authBearer('this is not the token we seek');

            case 14:
              response = _context7.sent;

              expect(response.status).toEqual('We should not reach this code GET 404');
              _context7.next = 21;
              break;

            case 18:
              _context7.prev = 18;
              _context7.t1 = _context7['catch'](11);

              expect(_context7.t1.status).toEqual(401);

            case 21:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, undefined, [[1, 7], [11, 18]]);
    })));

    test('GET 400 on bad query', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
      var profile, response;
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              profile = void 0;
              _context8.prev = 1;
              _context8.next = 4;
              return (0, _profileMock.createProfileMockPromise)();

            case 4:
              profile = _context8.sent;
              _context8.next = 10;
              break;

            case 7:
              _context8.prev = 7;
              _context8.t0 = _context8['catch'](1);
              throw _context8.t0;

            case 10:
              response = void 0;
              _context8.prev = 11;
              _context8.next = 14;
              return _superagent2.default.get(apiUrl + '/profiles').query({ EYEDEE: profile.accountId }).authBearer(token);

            case 14:
              response = _context8.sent;

              expect(response.status).toEqual('We should not reach this code GET 404');
              _context8.next = 21;
              break;

            case 18:
              _context8.prev = 18;
              _context8.t1 = _context8['catch'](11);

              expect(_context8.t1.status).toEqual(400);

            case 21:
            case 'end':
              return _context8.stop();
          }
        }
      }, _callee8, undefined, [[1, 7], [11, 18]]);
    })));
  });
});