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
module.exports = (fnc, perPage) => {
  perPage = perPage || 20;

  return function paginate(req, res, next) {
    res.locals.perPage = Math.max(0, req.query.limit) || perPage;

    fnc(_.omit(req.query, 'limit', 'sort', 'page'), (err, count) => {
      if (err) return next(err);

      res.locals.totalCount = count;

      next(err);
    });
  };
};
