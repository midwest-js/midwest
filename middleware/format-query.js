/*
 * Assists in formatting queries.
 *
 * @module midwest/middleware/format-query
 */
'use strict';

const _ = require('lodash');

const evals = ['undefined', 'null', 'false', 'true'];

const commonFilters = {
  regex(value) {
    return new RegExp(value, 'i');
  },

  exists(value) {
    if (value === true) {
      return { $ne: null };
    }

    return { $eq: null };
  },
};

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
module.exports = function (properties, filters, transform) {
  // allow properties to be filtered
  properties = _.union(properties, _.keys(filters));

  filters = _.mapValues(filters, (value) => (_.isString(value) ? commonFilters[value] : value));

  function mapQuery(value, key) {
    value = decodeURIComponent(value);

    // eslint-disable-next-line no-eval
    if (evals.indexOf(value) > -1) value = eval(value);

    return filters[key] ? filters[key](value) : value;
  }

  // return the actual middleware function
  return function formatQuery(req, res, next) {
    req.query = _.mapValues(_.pick(req.query, properties), mapQuery);

    if (transform instanceof Function) req.query = transform(req.query);

    next();
  };
};
