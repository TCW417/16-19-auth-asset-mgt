'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _account = require('../../model/account');

var _account2 = _interopRequireDefault(_account);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (request, response, next) {
  if (!request.headers.authorization) return next(new _httpErrors2.default(400, 'AUTH MIDDLEWARE - invalid request'));

  // if i make it past the if statement, I know I have the right headers
  var base64AuthHeader = request.headers.authorization.split(' ')[1];
  if (!base64AuthHeader) return next(new _httpErrors2.default(400, 'AUTH MIDDLEWARE - invalid request'));

  // base64AuthHeader is base64 encoded, so we use Node's Buffer class to make a new buffer out of it, inform the Buffer class it should expect a base64-encoded string (hence passing in the 'base64' arg), then we toString() it to convert it utf-8 to human readable form
  var stringAuthHeader = Buffer.from(base64AuthHeader, 'base64').toString();
  // at this point, stringAuthHeader loks like this: username:password

  // array destructuring

  var _stringAuthHeader$spl = stringAuthHeader.split(':'),
      _stringAuthHeader$spl2 = _slicedToArray(_stringAuthHeader$spl, 2),
      username = _stringAuthHeader$spl2[0],
      password = _stringAuthHeader$spl2[1];

  if (!username || !password) return next(new _httpErrors2.default(400, 'AUTH, invalid request'));

  // if we reached this point, we know that the user sent us a username and password
  // this is the same as return Account.findOne({ username: username})
  var account = void 0;
  return _account2.default.findOne({ username: username }).then(function (result) {
    if (!result) return next(new _httpErrors2.default(400, 'BASIC AUTH - invalid request'));
    account = result;
    return account.verifyPasswordPromise(password);
  }).then(function (verified) {
    if (verified) {
      request.account = account;
      return next();
    }
    // else
    return next(new _httpErrors2.default(400, 'BASIC AUTH - unable to validate user'));
  }).catch(next);
};