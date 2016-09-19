/*
 * Routes initializer
 *
 * @module midwest/util/initRoutes
 */

'use strict'

// modules > 3rd party
const _ = require('lodash')

// modules > midwest
const parallel = require('../middleware/parallel')

/*
 * Initializes an array of routes on an express instance
 *
 * @param {Object} router Router or Express instance to set up routes on
 * @param {Array[]} routes Array of routes. Either just a function or array (`[ path, method, middleware ]`, or `[ path, metod, [ mw1, mw2 ] ]`)
 * @returns {undefined}
 */
module.exports = function initRoutes(router, routes) {
  _.each(routes, (route) => {
    if (_.isFunction(route)) {
      router.use(route)
    } else if (_.isArray(route)) {
      let [ path, method, ...middleware ] = route

      if (_.isEmpty(middleware))
        throw new Error('No middleware defined for [' + method + ']:' + path)

      middleware = middleware.map((mw) => {
        if (_.isArray(mw)) {
          return parallel(mw)
        } else if (!_.isFunction(mw)) {
          throw new Error('Undefined or non-function middleware found [' + method + ']:' + path)
        }

        return mw
      })

      // use spread operator so it works with `router.param` (which only accepts
      // a single function, not an array of fncs)
      router[method](path, ...middleware)
    } else {
      throw new Error('Route is not an Array or Function.')
    }
  })
}
