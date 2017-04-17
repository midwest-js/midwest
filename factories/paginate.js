/* Middleware that helps pagination
 *
 * @module midwest/middleware/paginate
 */

'use strict';

const _ = require('lodash');

/* Middleware factory
 *
 * @param {mongoose.Model} Model - Model that will be paginated
 * @param {Number} perPage - Number of results per page
 *
 * @return A middleware function
 */
module.exports = (fnc, defaultLimit = 20) => {
  return function paginate(req, res, next) {
    req.query.offset = parseInt(req.query.offset, 10) || 0;
    req.query.limit = parseInt(req.query.limit, 10) || defaultLimit;

    fnc(_.omit(req.query, 'limit', 'sort', 'offset')).then((totalCount) => {
      res.locals.pagination = {
        offset: req.query.offset,
        limit: req.query.limit,
        totalCount,
      };

      next();

      return null;
    }).catch(next);
  };
};
