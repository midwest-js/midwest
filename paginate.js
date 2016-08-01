/* Middleware that helps pagination
 *
 * @module warepot/paginate
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
module.exports = function (Model, perPage) {
  perPage = perPage || 20;

  return function (req, res, next) {
    //res.locals.query = req.url.slice(req.url.indexOf('?')).slice(1);
    res.locals.query = req.query;
    res.locals.perPage = Math.max(0, req.query.limit) || perPage;

    Model.count(_.omit(req.query, 'limit', 'sort', 'page'), function (err, count) {
      res.locals.totalCount = count;
      next(err);
    });
  };
};
