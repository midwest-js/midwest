/*
 * Routes initializer
 *
 * @module warepot/util/initRoutes
 */

'use strict'

// modules > 3rd party
const _ = require('lodash')

/*
 * Initializes an array of routes on an express instance
 *
 * @param {Object} express Express instance to set up routes on
 * @param {Array[]} routes Array of routes. Either just a function or array (`[ path, method, middleware ]`, or `[ path, metod, [ mw1, mw2 ] ]`)
 * @returns {undefined}
 */
module.exports = function initRoutes(express, routes) {
  _.each(routes, (route) => {
    if (_.isFunction(route)) {
      express.use(route)
    } else if (_.isArray(route)) {
      const [ path, method, middleware ] = route

      if (!_.isFunction(middleware) && (_.isEmpty(middleware) || _.some(middleware, (value) => !_.isFunction(value)))) {
        throw new Error('Undefined or non-function as middleware for [' + method + ']:' + path)
      }

      express[method](path, middleware)
    } else {
      throw new Error('Route is not an Array or Function.')
    }
  })
}
