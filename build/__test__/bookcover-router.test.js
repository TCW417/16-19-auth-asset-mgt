'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _superagentAuthBearer = require('superagent-auth-bearer');

var _superagentAuthBearer2 = _interopRequireDefault(_superagentAuthBearer);

var _server = require('../lib/server');

var _bookcoverMock = require('./lib/bookcover-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

(0, _superagentAuthBearer2.default)(_superagent2.default);

var dogMp3 = __dirname + '/asset/dog.mp3';
var apiUrl = 'http://localhost:' + process.env.PORT + '/api/bookcovers';

describe('TESTING ROUTES AT /api/bookcovers', function () {
  var token = void 0;
  var cover = void 0;
  beforeAll(_server.startServer);
  afterAll(_server.stopServer);
  beforeEach(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var mockData;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (0, _bookcoverMock.createCoverMockPromise)();

          case 3:
            mockData = _context.sent;

            token = mockData.token; /*eslint-disable-line*/
            cover = mockData.cover; /*eslint-disable-line*/
            _context.next = 11;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context['catch'](0);
            throw _context.t0;

          case 11:
            return _context.abrupt('return', undefined);

          case 12:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 8]]);
  })));
  afterEach(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _bookcoverMock.removeCoversAndAccounts)();

          case 2:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));

  describe('POST ROUTES TO /api/bookcovers', function () {
    test('POST 200', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      var response;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return _superagent2.default.post(apiUrl).authBearer(token).field('title', 'lonesome dove').attach('cover', dogMp3);

            case 3:
              response = _context3.sent;

              expect(response.status).toEqual(200);
              expect(response.body.title).toEqual('lonesome dove');
              expect(response.body._id).toBeTruthy();
              expect(response.body.url).toBeTruthy();
              expect(response.body.url).toBeTruthy();
              Object.assign(cover, response.body);
              _context3.next = 15;
              break;

            case 12:
              _context3.prev = 12;
              _context3.t0 = _context3['catch'](0);

              expect(_context3.t0).toEqual('POST 200 bookcover unexpected error');

            case 15:
              return _context3.abrupt('return', undefined);

            case 16:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined, [[0, 12]]);
    })));

    test('POST 400 to /api/bookcovers with bad request', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
      var response;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              _context4.next = 3;
              return _superagent2.default.post(apiUrl).authBearer(token).field('not-title', 'lonesome dove').attach('cover', dogMp3);

            case 3:
              response = _context4.sent;

              expect(response).toEqual('POST 400 unexpected response');
              _context4.next = 10;
              break;

            case 7:
              _context4.prev = 7;
              _context4.t0 = _context4['catch'](0);

              expect(_context4.t0.status).toEqual(400);

            case 10:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, undefined, [[0, 7]]);
    })));

    test('POST 401 to /api/bookcovers with bad token', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
      var response;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              _context5.next = 3;
              return _superagent2.default.post(apiUrl).authBearer('bad-token').field('title', 'lonesome dove').attach('cover', dogMp3);

            case 3:
              response = _context5.sent;

              expect(response).toEqual('POST 401 unexpected response');
              _context5.next = 10;
              break;

            case 7:
              _context5.prev = 7;
              _context5.t0 = _context5['catch'](0);

              expect(_context5.t0.status).toEqual(401);

            case 10:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, undefined, [[0, 7]]);
    })));
  });

  describe('GET ROUTES to /api/bookcovers', function () {
    test('200 GET /api/bookcovers for succesful fetching of a cover', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
      var response;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              _context6.next = 3;
              return _superagent2.default.get(apiUrl + '/' + cover._id).authBearer(token);

            case 3:
              response = _context6.sent;

              expect(response.status).toEqual(200);
              expect(response.body.title).toEqual(cover.title);
              expect(response.body.accountId).toEqual(cover.accountId.toString());
              expect(response.body.url).toEqual(cover.url);
              expect(response.body.fileName).toEqual(cover.fileName);
              _context6.next = 14;
              break;

            case 11:
              _context6.prev = 11;
              _context6.t0 = _context6['catch'](0);

              expect(_context6.t0).toEqual('FAILING IN GET 200 POST');

            case 14:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, undefined, [[0, 11]]);
    })));

    test('404 GET /api/bookcovers with bad cover id', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
      var response;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.prev = 0;
              _context7.next = 3;
              return _superagent2.default.get(apiUrl + '/1234567890').authBearer(token);

            case 3:
              response = _context7.sent;

              expect(response).toEqual('404 GET returned unexpected response');
              _context7.next = 10;
              break;

            case 7:
              _context7.prev = 7;
              _context7.t0 = _context7['catch'](0);

              expect(_context7.t0.status).toEqual(404);

            case 10:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, undefined, [[0, 7]]);
    })));
  });

  describe('DELETE ROUTES to /api/bookcovers', function () {
    test('200 DELETE /api/bookcovers for successful deletion of a cover', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
      var response;
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.prev = 0;
              _context8.next = 3;
              return _superagent2.default.delete(apiUrl + '/' + cover._id).authBearer(token);

            case 3:
              response = _context8.sent;

              expect(response.status).toEqual(200);
              _context8.next = 10;
              break;

            case 7:
              _context8.prev = 7;
              _context8.t0 = _context8['catch'](0);

              expect(_context8.t0.message).toEqual('FAILING TO GET GOOD STATUS FROM DELETE');

            case 10:
            case 'end':
              return _context8.stop();
          }
        }
      }, _callee8, undefined, [[0, 7]]);
    })));

    test('404 DELETE /api/bookcovers with bad cover id', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
      var response;
      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.prev = 0;
              _context9.next = 3;
              return _superagent2.default.get(apiUrl + '/1234567890').authBearer(token);

            case 3:
              response = _context9.sent;

              expect(response).toEqual('404 DELETE returned unexpected response');
              _context9.next = 10;
              break;

            case 7:
              _context9.prev = 7;
              _context9.t0 = _context9['catch'](0);

              expect(_context9.t0.status).toEqual(404);

            case 10:
            case 'end':
              return _context9.stop();
          }
        }
      }, _callee9, undefined, [[0, 7]]);
    })));
  });
});