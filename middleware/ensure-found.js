/*
 * Ensures something has been found during the request.  Returns 404 if
 * res.template is unset, res.locals is empty and statusCode has not been set
 * to 204.
 *
 * Should be placed at the very end of the middleware pipeline,
 * after all project specific routes but before the error handler & responder.
 *
 * @module midwest/middleware/ensure-found
 */

'use strict';

const _ = require('lodash');

module.exports = function ensureFound(req, res, next) {
  // it seems most reasonable to check if res.locals is empty before res.statusCode
  // because the former is much more common
  if (res.template || res.master || !_.isEmpty(res.locals) || res.statusCode === 204) {
    next();
  } else {
    // generates Not Found error if there is no page to render and no truthy
    // values in data
    const err = new Error(`Not found: ${req.path}`);
    err.status = 404;

    next(err);
  }
};
