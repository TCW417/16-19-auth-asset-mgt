'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeCoversAndAccounts = exports.createCoverMockPromise = undefined;

require('babel-polyfill');

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _accountMock = require('./account-mock');

var _bookcover = require('../../model/bookcover');

var _bookcover2 = _interopRequireDefault(_bookcover);

var _account = require('../../model/account');

var _account2 = _interopRequireDefault(_account);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var createCoverMockPromise = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var mockData, mockAcctResponse, cover;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            mockData = {};
            // mockAcctResponse will equal:
            /*
              {
                originalRequest: {},
                token: some token,
                account: { mongDb account}
              }
            */

            _context.next = 3;
            return (0, _accountMock.createAccountMockPromise)();

          case 3:
            mockAcctResponse = _context.sent;

            // console.log(mockAcctResponse, 'inside async await');
            mockData.account = mockAcctResponse.account;
            mockData.token = mockAcctResponse.token;
            _context.next = 8;
            return new _bookcover2.default({
              title: _faker2.default.lorem.words(2),
              url: _faker2.default.random.image(),
              fileName: _faker2.default.system.fileName(),
              accountId: mockData.account._id
            }).save();

          case 8:
            cover = _context.sent;

            // console.log(COVER, cover);
            mockData.cover = cover;
            return _context.abrupt('return', mockData);

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function createCoverMockPromise() {
    return _ref.apply(this, arguments);
  };
}();

var removeCoversAndAccounts = function removeCoversAndAccounts() {
  return Promise.all([_bookcover2.default.remove({}), _account2.default.remove({})]);
};

exports.createCoverMockPromise = createCoverMockPromise;
exports.removeCoversAndAccounts = removeCoversAndAccounts;