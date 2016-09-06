/*
 * Sets `key` property on `res.locals` to `value`
 *
 * @module midwest/set-local
 */
'use strict'

const _ = require('lodash')

/* Middleware factory
 *
 * @param String key - Property on `res.locals` to set
 * @param {} value - Value to set
 *
 * @returns A middleware function
 */
module.exports = (key, value) => {
  const fnc = function (req, res, next) {
    res.locals[key] = value

    next()
  }

  // set more descriptive name
  fnc.name = 'setLocal' + _.upperFirst(_.camelCase(key))

  return fnc
}
