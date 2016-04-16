'use strict';

const _ = require('lodash');

module.exports = function (statusCode, url) {
  if (_.isString(statusCode)) {
    url = statusCode;

    statusCode = 302;
  }

  return function redirect(req, res) {
    res.redirect(statusCode, url);
  };
};
