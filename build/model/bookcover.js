'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var coverSchema = _mongoose2.default.Schema({
  title: {
    type: String,
    required: true
  },
  // this url will map back to the AWS url that AWS S3 gives me after succesful upload
  url: {
    type: String,
    required: true
  },
  // also comes from AWS
  fileName: {
    type: String
  },
  accountId: {
    type: _mongoose2.default.Schema.Types.ObjectId,
    required: true
  }
}, { timestamps: true });

var skipInit = process.env.NODE_ENV === 'development';
exports.default = _mongoose2.default.model('Bookcover', coverSchema, 'bookCovers', skipInit);