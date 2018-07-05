'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// We are establishing a 1-1 relationship here, where one user account can only map back to one profile
// Can an account have more than one profile. Sure. You can make your design choices in your own project on this matter. But for now, we will establish this as a 1-1 relationship.

var profileSchema = _mongoose2.default.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: { type: String },
  bio: { type: String },
  location: String,
  profileImageUrl: { type: String },
  accountId: {
    type: _mongoose2.default.Schema.Types.ObjectId,
    required: true,
    unique: true
  }
});

var skipInit = process.env.NODE_ENV === 'development';
exports.default = _mongoose2.default.model('profiles', profileSchema, 'profiles', skipInit);