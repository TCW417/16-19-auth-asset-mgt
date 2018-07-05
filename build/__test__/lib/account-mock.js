'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeAccountMockPromise = exports.createAccountMockPromise = undefined;

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _account = require('../../model/account');

var _account2 = _interopRequireDefault(_account);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createAccountMockPromise = function createAccountMockPromise() {
  var mockData = {};
  var originalRequest = {
    username: _faker2.default.internet.userName(),
    email: _faker2.default.internet.email(),
    password: _faker2.default.lorem.words(5)
  };

  return _account2.default.create(originalRequest.username, originalRequest.email, originalRequest.password).then(function (account) {
    mockData.originalRequest = originalRequest;
    mockData.account = account;
    return account.createTokenPromise(); // this line changes the token seed
  }).then(function (token) {
    mockData.token = token; // this is the signed JSON Web Token with tokenSeed as payload.
    // if I make it here, I know the account info has changed and was resaved to the db due to the previous account.createTokenPromise that got invoked above. So now we must retrieve the account again to get the most updated information from it
    return _account2.default.findById(mockData.account._id);
  }).then(function (account) {
    // because this account is newly updated with a new token seed, I need to reassign it to the "account" property on my mockData object I declared above
    mockData.account = account;
    return mockData;
  });
};

var removeAccountMockPromise = function removeAccountMockPromise() {
  return _account2.default.remove({});
};

exports.createAccountMockPromise = createAccountMockPromise;
exports.removeAccountMockPromise = removeAccountMockPromise;