/* Middleware that helps pagination
 *
 * @module midwest/middleware/paginate
 */

'use strict'

const _ = require('lodash')

/* Middleware factory
 *
 * @param {Function} count - Function returning promise for totalCount
 * @param {Number} defaultLimit - Number of results per page
 *
 * @return A middleware function
 */
module.exports = (count, defaultLimit = 20) => {
  return function paginate (req, res, next) {
    req.query.offset = parseInt(req.query.offset, 10) || 0
    req.query.limit = parseInt(req.query.limit, 10) || defaultLimit

    count(_.omit(req.query, 'limit', 'sort', 'offset')).then((totalCount) => {
      res.locals.pagination = {
        offset: req.query.offset,
        limit: req.query.limit,
        totalCount,
      }

      next()

      return null
    }).catch(next)
  }
}
