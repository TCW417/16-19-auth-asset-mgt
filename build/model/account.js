'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// a common styling convention is captialize constant strings and numbers

// this is used to generate a random hash
var HASH_ROUNDS = 4;

// used to generate random data

var TOKEN_SEED_LENGTH = 24;

// this schema should never be sent over the server in an API call. This data should only ever stay in the database

var accountSchema = _mongoose2.default.Schema({
  passwordHash: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  tokenSeed: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true });

// this is how we need to create instance methods according to Mongoose, using ".methods"
// this method is used during login to compare the plain text password entered by the user to the account's password hash
accountSchema.methods.verifyPasswordPromise = function verifyPasswordPromise(password) {
  return _bcrypt2.default.compare(password, this.passwordHash).then(function (result) {
    // result is just a boolean letting us know if the plain text password recvd equals the hashed password
    // if (!result) {
    //   // 401 is the error code for unauthorized access
    //   throw new HttpErrors(401, 'ACCOUNT MODEL: incorrect data');
    // }
    return result;
  }).catch(function (err) {
    throw new _httpErrors2.default(500, 'ERROR CREATING TOKEN: ' + JSON.stringify(err));
  });
};

accountSchema.methods.createTokenPromise = function createTokenPromise() {
  // anytime this method is called, we will always be resetting this account instance's tokenSeed property and resaving this instance with the newly updated seed
  this.tokenSeed = _crypto2.default.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
  return this.save().then(function (updatedAccount) {
    // at this point, we have a token seed generated
    // "sign" means "to encrypt"
    // this jsonWebToken.sign returns a promise that resolves with a token. When it resolves, I now have a token
    return _jsonwebtoken2.default.sign({ accountId: updatedAccount._id, tokenSeed: updatedAccount.tokenSeed }, process.env.SECRET);
  }).catch(function (err) {
    // you have to make a design choice how explicit you want to be with your error messages when handling errors for signup/login
    throw new _httpErrors2.default(500, 'ERROR SAVING ACCOUNT or ERROR WITH JWT: ' + JSON.stringify(err));
  });
};

var skipInit = process.env.NODE_ENV === 'development';

var Account = _mongoose2.default.model('accounts', accountSchema, 'accounts', skipInit);

Account.create = function (username, email, password) {
  // the bcrypt.hash method will hash the plaintext password 2^HASH_ROUNDS times, in this case 2^8 since we defined HASH_ROUNDS as "8" above. It is essentially doing this under the hood  The higher the hash rounds, the slower this process will be:
  /*
    brcrypt.hash(bcrypt.hash(bcrypt.hash(bcrypt.hash(bcrypt.hash(password, HASH_ROUNDS))))).....
  */
  return _bcrypt2.default.hash(password, HASH_ROUNDS).then(function (passwordHash) {
    password = null; /*eslint-disable-line*/
    var tokenSeed = _crypto2.default.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
    return new Account({
      username: username,
      email: email,
      passwordHash: passwordHash,
      tokenSeed: tokenSeed
    }).save();
  });
};

exports.default = Account;