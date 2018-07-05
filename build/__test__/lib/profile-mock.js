'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeAllResources = exports.createProfileMockPromise = undefined;

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _profile = require('../../model/profile');

var _profile2 = _interopRequireDefault(_profile);

var _accountMock = require('./account-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createProfileMockPromise = function createProfileMockPromise() {
  var mockData = {};

  return (0, _accountMock.createAccountMockPromise)().then(function (mockAccountData) {
    mockData.account = mockAccountData.account;
    mockData.token = mockAccountData.token;

    var mockProfile = {
      firstName: _faker2.default.name.firstName(),
      lastName: _faker2.default.name.lastName(),
      location: _faker2.default.address.city(),
      profileImageUrl: _faker2.default.random.image(),
      accountId: mockAccountData.account._id
    };
    return new _profile2.default(mockProfile).save();
  }).then(function (profile) {
    mockData.profile = profile;
    return mockData;
  }).catch(function (err) {
    throw err;
  });
};

var removeAllResources = function removeAllResources() {
  return Promise.all([_profile2.default.remove({}), (0, _accountMock.removeAccountMockPromise)()]);
};

exports.createProfileMockPromise = createProfileMockPromise;
exports.removeAllResources = removeAllResources;