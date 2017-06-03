/*
 * Assists in formatting queries.
 *
 * @module midwest/middleware/format-query
 */

'use strict'

const _ = require('lodash')

const evals = ['undefined', 'null', 'false', 'true']

/*
 * Middleware factory.
 *
 * @param {Array} properties - Allowed properties. Will be unioned
 * with keys in filters object.
 * @param {Object} filters - Object containing filter functions.
 * @param {Function} transform - Optional function that is called at the end
 * of the middleware and passed the query. Should return a new query object.
 *
 * @return A middleware function
 */

const paginateProperties = ['sort', 'limit', 'offset']

module.exports = function ({ paginate, defaults, properties, filters, transform }) {
  // allow properties to be filtered
  properties = _.union(properties, _.keys(filters), paginate && paginateProperties)

  function mapQuery (value, key) {
    value = decodeURIComponent(value)

    // eslint-disable-next-line no-eval
    if (evals.includes(value)) value = eval(value)

    return filters && filters[key] instanceof Function ? filters[key](value) : value
  }

  // return the actual middleware function
  return function formatQuery (req, res, next) {
    req.query = _.defaults(_.mapValues(_.pick(req.query, properties), mapQuery), defaults)

    if (transform instanceof Function) req.query = transform(req.query)

    next()
  }
}
