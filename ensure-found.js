/*
 * Ensures something has been found during the request.  Returns 404 if
 * res.template is unset, res.locals is empty and statusCode has not been set
 * to 204.
 *
 * Should be placed at the very end of the middleware pipeline,
 * after all project specific routes but before the error handler & responder.
 *
 * @module warepot/ensure-found
 */

'use strict'

const _ = require('lodash')

module.exports = function ensureFound(req, res, next) {
  if (res.template || _.some(res.locals) || res.statusCode === 204) {
    next()
  } else {
    // generates Not Found error if there is no page to render and no truthy values in data
    next(Object.assign(new Error('Not found: ' + req.path), {
      status: 404
    }))
  }
}
