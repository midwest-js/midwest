/*
 * Simply sets res.template.
 *
 * @module midwest/middleware/set-template
 */
'use strict'

/* Middleware factory
 *
 * @param {} template - Template to set on `res`.
 *
 * @returns A middleware function
 */
module.exports = (template) => function setTemplate(req, res, next) {
  res.template = template
  next()
}
