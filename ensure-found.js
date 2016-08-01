/*
 * Ensures something has been found during the request.
 * Returns 404 if res.locals is empty and res.template is unset.
 *
 * Should be placed at the very end of the middleware pipeline,
 * after all project specific routes but before the error handler.
 *
 * @module warepot/ensure-found
 */

'use strict';

const _ = require('lodash');

module.exports = function ensureFound(req, res, next) {
  if (res.template || _.some(res.locals)) {
    next();
  } else {
    // generates Not Found error if there is no page to render and no truthy values in data
    const err = new Error('Not found: ' + req.path);
    err.status = 404;
    next(err);
  }
};
