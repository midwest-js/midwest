/*
 * @module warepot/page
 */
'use strict'

const _ = require('lodash')

/*
 * Middleware factory
 *
 * @param {Object} page - Page object saved to res.locals.page
 * @param {Object|Array} navigation - navigation for this particular page
 *
 * @return A middleware function
 */
module.exports = function (page, navigation) {
  /* we use defineProperty to avoid name collisions between page argument and
   * page middleware function We work this hard to maintain names for
   * middlewares so it is easier debugging the routes.
   */
  return Object.defineProperty(function (req, res, next) {
    res.locals.page = _.defaults({
      routePath: page.path,
      path: req.path
    }, page, 'template')

    if (!req.xhr) {
      res.locals.user = req.user
      res.locals.navigation = navigation
    }

    next()
  }, 'name', { value: 'page' })
}
