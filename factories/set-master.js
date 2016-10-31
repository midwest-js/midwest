/*
 * Simply sets res.master.
 *
 * @module midwest/middleware/semaster-template
 */
'use strict';

/* Middleware factory
 *
 * @param {} master - Master to set on `res`.
 *
 * @returns A middleware function
 */
module.exports = (master) => function setMaster(req, res, next) {
  res.master = master;
  next();
};
