'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _server = require('../lib/server');

var _accountMock = require('./lib/account-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiUrl = 'http://localhost:' + process.env.PORT + '/api';

describe('AUTH router', function () {
  beforeAll(_server.startServer);
  afterAll(_server.stopServer);
  beforeEach(_accountMock.removeAccountMockPromise);

  test('POST 200 to /api/signup for successful account creation and receipt of a TOKEN', function () {
    var mockAccount = {
      username: _faker2.default.internet.userName(),
      email: _faker2.default.internet.email(),
      password: 'thisIsATerriblePassword1234'
    };
    return _superagent2.default.post(apiUrl + '/signup').send(mockAccount).then(function (response) {
      expect(response.status).toEqual(200);
      expect(response.body.token).toBeTruthy();
    }).catch(function (err) {
      throw err;
    });
  });

  test('POST 409 to api/login conflicting user info', function () {
    var conflict = void 0;
    return (0, _accountMock.createAccountMockPromise)().then(function (mockData) {
      conflict = mockData.originalRequest;
      return _superagent2.default.post(apiUrl + '/signup').send(conflict); // this is how we send authorization headers via REST/HTTP
    }).then(function (response) {
      // When I login, I get a 200 status code and a TOKEN
      expect(response.status).toEqual(409);
      expect(response.body.token).toBeTruthy();
      // expect(response.body.token).toEqual(token);
    }).catch(function (err) {
      expect(err.status).toEqual(409);
    });
  });

  test('POST 400 to api/login missing user info', function () {
    var mockAccount = {
      username: _faker2.default.internet.userName(),
      // email: faker.internet.email(),
      password: 'thisIsATerriblePassword1234'
    };
    return _superagent2.default.post(apiUrl + '/signup').send(mockAccount).then(function (response) {
      throw response;
      // expect(response.status).toEqual(200);
      // expect(response.body.token).toBeTruthy();
    }).catch(function (err) {
      expect(err.status).toEqual(400);
    });
  });

  test('GET 200 to api/login for successful login and receipt of a TOKEN', function () {
    // in order to login, we need to create a mock account first
    // let token;
    return (0, _accountMock.createAccountMockPromise)().then(function (mockData) {
      // token = mockData.token; 
      return _superagent2.default.get(apiUrl + '/login').auth(mockData.account.username, mockData.originalRequest.password); // this is how we send authorization headers via REST/HTTP
    }).then(function (response) {
      // When I login, I get a 200 status code and a TOKEN
      expect(response.status).toEqual(200);
      expect(response.body.token).toBeTruthy();
      // expect(response.body.token).toEqual(token);
    }).catch(function (err) {
      throw err;
    });
  });

  test('GET 400 to /api/login for unsuccesful login with bad username and password', function () {
    return _superagent2.default.get(apiUrl + '/login').auth('bad username', 'bad password').then(function (response) {
      throw response;
    }).catch(function (err) {
      expect(err.status).toEqual(400);
    });
  });

  test('GET 400 to api/login for good username, bad password', function () {
    // in order to login, we need to create a mock account first
    // let token;
    return (0, _accountMock.createAccountMockPromise)().then(function (mockData) {
      // token = mockData.token; 
      return _superagent2.default.get(apiUrl + '/login').auth(mockData.account.username, 'nottheirpassword');
    }).then(function (response) {
      throw response;
    }).catch(function (err) {
      expect(err.status).toEqual(400);
    });
  });

  test('GET 400 to api/login for bad username, good password', function () {
    // in order to login, we need to create a mock account first
    // let token;
    return (0, _accountMock.createAccountMockPromise)().then(function (mockData) {
      return _superagent2.default.get(apiUrl + '/login').auth('nottherightusername', mockData.account.password);
    }).then(function (response) {
      throw response;
    }).catch(function (err) {
      expect(err.status).toEqual(400);
    });
  });
});