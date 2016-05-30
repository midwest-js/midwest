'use strict';

/*
 * Routes initializer
 *
 * @module server/util/initRoutes
 */

// modules > 3rd party
const _ = require('lodash');

/*
 * Initializes an array of routes on an express instance
 *
 * @param {Object} express Express instance to set up routes on
 * @param {Array[]} routes Array of routes. Either just a function or array [ path, method, middleware ]
 * @returns {undefined}
 */
module.exports = function initRoutes(express, routes) {
  _.each(routes, (route) => {
    if (_.isArray(route) && _.isString(route[0])) {
      const path = route[0];
      const method = route[1] || 'use';
      const middleware = route[2];

      if (!_.isFunction(middleware) && (_.isEmpty(middleware) || _.some(middleware, (value) => !_.isFunction(value)))) {
        throw new Error('Undefined or non-function as middleware for [' + method + ']:' + path);
      }

      express[method](path, middleware);
    } else {
      express.use(route);
    }
  });
};
