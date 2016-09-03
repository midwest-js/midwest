/*
 * Simply sets res.master.
 *
 * @module warepot/set-master
 */
'use strict'

/* Middleware factory
 *
 * @param {} master - Template to set as master.
 *
 * @returns A middleware function
 */
module.exports = function (master) {
  return function setMaster(req, res, next) {
    res.master = master
    next()
  }
}
