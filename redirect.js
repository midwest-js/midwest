/* Simple redirect middleware
 *
 * @module warepot/redirect
 */
'use strict';

const _ = require('lodash');

/* Middleware factory
 *
 * @param {Number} statusCode - Status code to return to client
 * @param {String} url - URL to redirect to
 *
 * @returns A middleware function
 */
module.exports = function (statusCode, url) {
  if (_.isString(statusCode)) {
    url = statusCode;

    statusCode = 302;
  }

  return function redirect(req, res) {
    res.redirect(statusCode, url);
  };
};
