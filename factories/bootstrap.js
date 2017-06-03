/*
 * Simple middleware that saves res.locals as stringified JSON to
 * `res.locals.INITIAL_STATE`
 *
 * @module midwest/middleware/bootstrap
 */

'use strict'

const _ = require('lodash')

const defaultOmit = ['settings']

module.exports = function (pick, omit, property = 'INITIAL_STATE') {
  omit = omit ? defaultOmit.concat(omit) : defaultOmit

  return function bootstrap (req, res, next) {
    if (!req.xhr && req.accepts(['json', '*/*']) === '*/*') {
      let obj = Object.assign({}, res.app.locals, res.locals)

      if (pick) {
        obj = _.pick(obj, pick)
      } else {
        obj = _.omit(obj, omit)
      }

      res.locals[property] = JSON.stringify(obj)
    }

    next()
  }
}
