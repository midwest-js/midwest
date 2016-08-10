/* Middleware that handles errors in responder.
 *
 * Needs to be placed right after responder
 *
 * @module warepot/responder-error
 *
 * @see module:warepot/responder
 */
'use strict'

const logError = require('./util/log-error')

module.exports = function responderError(err, req, res, next) {
  // TODO maybe tag or name this error so it is easy to find responder errors.
  // these should almost never occur. it is usually due to a render error
  console.error('[!!!] ERROR IN RESPONDER, RESPONDER ERROR')

  logError(err)

  if (res.locals.error) {
    console.error('[!!!] ERROR IN RESPONDER, ORIGINAL ERROR')

    logError(res.locals.error, req, { format: false, store: false })
  }
  res.send((res.locals.error || err) + '')
}
