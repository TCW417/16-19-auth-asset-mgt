'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.s3Remove = exports.s3Upload = undefined;

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var s3Upload = function s3Upload(path, key) {
  var aws = require('aws-sdk');
  var amazonS3 = new aws.S3();
  var uploadOptions = {
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    ACL: 'public-read',
    Body: _fsExtra2.default.createReadStream(path) // sends data of file one chunk at a time
  };

  // amazonS3's upload method expects an argument of the above options
  return amazonS3.upload(uploadOptions).promise()
  // this is amazonS3's internal way of promisifying their callback functions
  .then(function (response) {
    _logger2.default.log(_logger2.default.INFO, 'RECEIVED RESPONSE FROM AWS: ' + JSON.stringify(response, null, 2));
    return _fsExtra2.default.remove(path).then(function () {
      return response.Location;
    }) // this returns the generated AWS S3 bucket URL for our file after a successful upload to S3
    .catch(Promise.reject);
  }).catch(function (err) {
    return _fsExtra2.default.remove(path).then(function () {
      return Promise.reject(err);
    }).catch(function (fsErr) {
      return Promise.reject(fsErr);
    });
  });
};

var s3Remove = function s3Remove(key) {
  var aws = require('aws-sdk');
  var amazonS3 = new aws.S3();
  var removeOptions = {
    Key: key,
    Bucket: process.env.AWS_BUCKET
  };
  return amazonS3.deleteObject(removeOptions).promise();
};

exports.s3Upload = s3Upload;
exports.s3Remove = s3Remove;