'use strict';

const _ = require('lodash');

const evals = [ 'undefined', 'null', 'false', 'true' ];

const _filters = {
  regex(value) {
    return new RegExp(value, 'i');
  },

  exists(value) {
    if (value === true)
      return { $ne: null };

    return { $eq: null };
  }
};

module.exports = function (properties, filters, transform) {
  properties = _.union(properties, _.keys(filters));

  filters = _.mapValues(filters, function (value) {
    return _.isString(value) ? _filters[value] : value;
  });

  return function (req, res, next) {
    req.query = _.mapValues(_.pick(req.query, properties), function (value, key) {
      value = decodeURIComponent(value);

      if (evals.indexOf(value) > -1) value = eval(value);

      return filters[key] ? filters[key](value) : value;
    });

    if (transform instanceof Function) req.query = transform(req.query);

    next();
  };
};
