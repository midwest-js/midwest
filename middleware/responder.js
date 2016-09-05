/*
 * The responder. Should handle sending response for most routes,
 * including errored requests.
 *
 * Will send `res.locals` as JSON if JSON is requested, otherwise
 * it will render res.template (with res.locals, obviously).
 *
 * @module warepot/responder
 */
'use strict'

// modules > 3rd party
const _ = require('lodash')
const debug = require('debug')('warepot:responder')

module.exports = function responder(req, res) {
  function sendJSON() {
    const keys = Object.keys(res.locals)

    /* if there is only a single property on `res.locals` and it is not a page
     * object (this can be a model/object or collection/array) then only
     * return that property.
     */

    res.json(keys.length === 1 && keys[0] !== 'page' ? res.locals[keys[0]] : _.omit(res.locals, 'query'))
  }

  try {
    res.format({
      json() {
        debug('ACCEPTS json, returning json')

        sendJSON()
      },

      html() {
        debug('ACCEPTS html, returning html')

        if (res.template)
          return res.render(res.template)

        res.send('<pre>' + JSON.stringify(res.locals, null, '  ') + '</pre>')
      },

      '*/*'() {
        debug('ACCEPTS */*...')

        if (res.template) {
          debug('res.template set, sending HTML.')

          res.set('Content-Type', 'text/html')

          return res.render(res.template)
        }

        debug('res.template not set, sending JSON.')

        sendJSON()
      }
    })
  } catch (e) {
    const logError = require('../util/log-error')

    // TODO maybe tag or name this error so it is easy to find responder errors.
    // these should almost never occur. it is usually due to a render error
    console.error('[!!!] ERROR IN RESPONDER, RESPONDER ERROR')

    logError(e)

    if (res.locals.error) {
      console.error('[!!!] ERROR IN RESPONDER, ORIGINAL ERROR')

      logError(res.locals.error, req, { format: false, store: false })
    }

    res.send((res.locals.error || e) + '')
  }
}
