'use strict';

const _ = require('lodash');

const factories = {
  create(plural, singular, handlers) {
    return function create(req, res, next) {
      handlers.create(req.body).then((row) => {
        res.set('Location', `${req.url}/${row.id}`)
          .status(201)
          .locals[singular] = row;

        next();
      }).catch(next);
    };
  },

  // use req.query to query database.
  // should probably be used with `midwest/middleware/format-query` and/or
  // `midwest/middleware/paginate`
  find(plural, singular, handlers) {
    return function find(req, res, next) {
      handlers.find(req.query).then((rows) => {
        res.locals[plural] = rows;

        next();
      }).catch(next);
    };
  },

  findById(plural, singular, handlers) {
    return function findById(req, res, next) {
      if (req.params.id === 'new') return void next();

      handlers.findById(req.params.id).then((row) => {
        res.locals[singular] = row;

        next();
      }).catch(next);
    };
  },

  getAll(plural, singular, handlers) {
    return function getAll(req, res, next) {
      handlers.getAll().then((rows) => {
        res.locals[plural] = rows;

        return next();
      }).catch(next);
    };
  },

  remove(plural, singular, handlers) {
    return function remove(req, res, next) {
      handlers.remove(req.params.id).then((count) => {
        if (count > 0) {
          res.status(204);
        }

        next();
      }).catch(next);
    };
  },

  replace(plural, singular, handlers) {
    // completely replaces the doc
    // SHOULD be used with PUT
    return function replace(req, res, next) {
      handlers.replace(req.params.id, req.body).then((row) => {
        // TODO return different status if nothing updated
        res.status(201).locals[singular] = row;

        next();
      }).catch(next);
    };
  },

  update(plural, singular, handlers) {
    // changes properties passed on req.body
    // SHOULD be used with PATCH
    return function update(req, res, next) {
      // enable using using _hid (not that _id MUST be a ObjectId)
      return handlers.update(req.params.id, req.body).then((row) => {
        console.log(row);
        // TODO return different status if nothing updated
        res.status(201).locals[singular] = row;

        next();
      }).catch(next);
    };
  },
};

const all = Object.keys(factories);

module.exports = ({ plural, singular, handlers }) => {
  singular = singular || plural.slice(0, -1);

  const missing = _.difference(all, Object.keys(handlers));

  if (missing.length) {
    throw new Error(`Missing "${plural}" handlers: ${missing.join(', ')}`);
  }

  const include = all;

  return include.reduce((result, value) => {
    if (factories[value]) {
      result[value] = factories[value](plural, singular, handlers);
    }

    return result;
  }, {});
};
