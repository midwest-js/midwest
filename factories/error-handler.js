/*
 * Error handling middleware factory
 *
 * @see module:midwest/util/format-error
 * @see module:midwest/util/log-error
 */
'use strict';

// modules > 3rd party
const _ = require('lodash');

// modules > internal
const format = require('../util/format-error');
const log = require('../util/log-error');

module.exports = function (config) {
  if (!config) {
    throw new Error('`config` required for errorHandler middleware factory');
  }

  return function errorHandler(error, req, res, next) {
    error = format(error, req, config);

    log(error, req, config.log);

    // limit what properties are sent to the client by overriding toJSON().
    if (req.isAdmin && !req.isAdmin()) {
      error.toJSON = function () {
        return _.pick(this, config.mystify.properties);
      };
    }

    res.status(error.status).locals = { error };

    if (config.post) {
      console.log('n\n\n\n\n\npost!');
      config.post(req, res, next);
    } else {
      next();
    }
  };
};
