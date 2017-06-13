/*
 * The responder. Should handle sending response for most routes,
 * including errored requests.
 *
 * Will send `res.locals` as JSON if JSON is requested, otherwise
 * it will render res.template (with res.locals, obviously).
 *
 * @module midwest/middleware/responder
 */

'use strict'

// modules > 3rd party
const _ = require('lodash')
const debug = require('debug')('midwest:responder')

const responses = {
  json (res) {
    // TODO now this function is also called by '*/*'
    debug('ACCEPTS json, returning json')

    /* if preventFlatten is not truthy and there is only a
     * single property on `res.locals` then we should only return that
     * property.
     *
     * this is to prevent api routes from sending nested json object. (eg
     * `/api/employees` returning { employees: [Employee] } or /api/employees/:id
     * returning { employee: Employee }
     */
    res.json(!res.preventFlatten &&
      Object.keys(res.locals).length === 1 ? _.values(res.locals)[0] : res.locals ||
      {})
  },

  html (res) {
    debug('ACCEPTS html, returning html')

    if (res.templates || res.master) {
      debug('res.templates or res.master set, rendering.')

      const templates = res.templates || []

      return void res.render(res.master, ...templates)
    }

    debug('res.template or res.master not set, sending <pre>.')

    res.send(`<pre>${JSON.stringify(res.locals, null, '  ')}</pre>`)
  },

  '*/*': function (res) {
    debug('ACCEPTS */*...')

    if (res.templates || res.master) {
      debug('res.templates or res.master set, rendering.')

      const templates = res.templates || []

      return void res.render(res.master, ...templates)
    }

    debug('res.template or res.master not set, sending JSON.')

    responses.json(res)
  }
}

module.exports = function responder (req, res) {
  if (res.template && !res.templates) {
    res.templates = [ res.template ]
  }

  try {
    responses[req.accepts(['html', 'json', '*/*'])](res)
  } catch (e) {
    const logError = require('../util/log-error')

    // TODO maybe tag or name this error so it is easy to find responder errors.
    // these should almost never occur. it is usually due to a render error
    console.error('[!!!] ERROR IN RESPONDER, RESPONDER ERROR')

    logError(e, null, { console: true }, true)

    if (res.locals.error) {
      console.error('[!!!] ERROR IN RESPONDER, ORIGINAL ERROR')

      logError(res.locals.error, req, { format: false, store: false })
    }

    res.send((res.locals.error || e).toString())
  }
}
