'use strict';

const _ = require('lodash');

const handlersFactory = require('./handlers');

const factories = {
  create(plural, singular, handlers) {
    return function create(req, res, next) {
      handlers.create(req.body, (err, row) => {
        if (err) return next(err);

        res.set('Location', `${req.url}/${row.id}`)
          .status(201)
          .locals[singular] = row;

        return next();
      });
    };
  },

  // use req.query to query database.
  // should probably be used with `midwest/middleware/format-query` and/or
  // `midwest/middleware/paginate`
  find(plural, singular, handlers) {
    return function find(req, res, next) {
      const page = Math.max(0, req.query.page) || 0;
      const limit = Math.max(0, req.query.limit) || res.locals.perPage;

      handlers.find(Object.assign({}, req.query, {
        page,
        limit,
      }), (err, rows) => {
        if (err) return next(err);

        res.locals[plural] = rows;

        next();
      });
    };
  },

  findById(plural, singular, handlers) {
    return function findById(req, res, next) {
      if (req.params.id === 'new') return void next();

      handlers.findById(req.params.id, (err, row) => {
        if (err) return next(err);

        res.locals[singular] = row;

        return next();
      });
    };
  },

  getAll(plural, singular, handlers) {
    return function getAll(req, res, next) {
      handlers.getAll((err, rows) => {
        if (err) return next(err);

        res.locals[plural] = rows;

        return next();
      });
    };
  },

  remove(plural, singular, handlers) {
    return function remove(req, res, next) {
      handlers.remove(req.params.id, (err, count) => {
        if (err) {
          return void next(err);
        }

        if (count > 0) {
          res.status(204);
        }

        next();
      });
    };
  },

  replace(plural, singular, handlers) {
    // completely replaces the doc
    // SHOULD be used with PUT
    return function replace(req, res, next) {
      // Note that if no doc is found, both err & doc are null.
      handlers.findByIdAndUpdate(query, _.omit(req.body, '_id', '__v'), { new: true, overwrite: true }, (err, row) => {
        if (err) return void next(err);

        res.status(201).locals[single] = row;

        next();
      });
    };
  },

  update(plural, singular, handlers) {
    // changes properties passed on req.body
    // SHOULD be used with PATCH
    return function update(req, res, next) {
      // enable using using _hid (not that _id MUST be a ObjectId)
      handlers.update(req.params.id, req.params.body, (err, row) => {
        if (err) return void next(err);

        res.status(201).locals[singular] = row;

        next();
      });
    };
  },
};

const all = Object.keys(factories);

module.exports = (plural, singular, handlers) => {
  singular = singular || plural.slice(0, -1);

  handlers = Object.assign(handlersFactory(plural, handlers ? Object.keys(handlers) : null), handlers);

  const include = all;

  return include.reduce((result, value) => {
    if (factories[value]) {
      result[value] = factories[value](plural, singular, handlers);
    }

    return result;
  }, {});
};
