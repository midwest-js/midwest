'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');

module.exports = (Model) => {
  // will be exactly what the user set, should be in Pascal Case.
  const singular = _.camelCase(Model.modelName);

  // will be an all lowercase, (sometimes poorly) pluralized version of
  // `singular`, such as Goose > gooses, Gallery > Galleries,
  // NewsArticle > newsarticles
  const collectionName = Model.collection.name;

  // since we want the plural name to be in camelCase as well,
  // we superimpose those characters that are the same from singular
  // on to plural (NewsArticle > newsArticles)
  const plural = _.reduce(collectionName, (str, char, i) => {
    const otherChar = singular.charAt(i);

    return str + (otherChar && otherChar.toLowerCase() === char ? otherChar : char);
  }, '');

  function create(req, res, next) {
    Model.create(req.body, (err, doc) => {
      if (err) return next(err);

      /* eslint-disable-next-line */
      res.set('Location', `${req.url}/${doc._id}`)
        .status(201)
        .locals[singular] = doc.toJSON();

      return next();
    });
  }

  function findById(req, res, next) {
    if (req.params.id === 'new') return void next();

    Model.findOne({ _id: req.params.id }).lean().exec((err, doc) => {
      if (err) return next(err);

      res.locals[singular] = doc;

      return next();
    });
  }

  function getAll(req, res, next) {
    Model.find({}).sort('name').lean().exec((err, docs) => {
      res.locals[plural] = docs;

      next(err);
    });
  }

  // use req.query to query database.
  // should probably be used with `midwest/middleware/format-query` and/or
  // `midwest/middleware/paginate`
  function query(req, res, next) {
    const page = Math.max(0, req.query.page) || 0;
    const perPage = Math.max(0, req.query.limit) || res.locals.perPage;

    const query = Model.find(_.omit(req.query, 'limit', 'sort', 'page'),
      null,
      { sort: req.query.sort || '-_id', lean: true });

    if (perPage) {
      query.limit(perPage).skip(perPage * page);
    }

    query.exec((err, docs) => {
      res.locals[plural] = docs;
      next(err);
    });
  }

  function remove(req, res, next) {
    Model.remove({ _id: req.params.id }, (err, obj) => {
      if (err) {
        return void next(err);
      }

      if (obj.result.n > 0) {
        res.status(204);
      }

      next();
    });
  }

  // completely replaces the doc
  // SHOULD be used with PUT
  function replace(req, res, next) {
    // enable using using _hid (not that _id MUST be a ObjectId)
    const query = {
      [mongoose.Types.ObjectId.isValid(req.params.id) ? '_id' : '_hid']: req.params.id,
    };

    // Note that if no doc is found, both err & doc are null.
    Model.findByIdAndUpdate(query, _.omit(req.body, '_id', '__v'), { new: true, overwrite: true }, (err, doc) => {
      if (err) return void next(err);

      res.locals[singular] = doc.toJSON();

      next();
    });
  }

  // changes properties passed on req.body
  // SHOULD be used with PATCH
  function update(req, res, next) {
    // enable using using _hid (not that _id MUST be a ObjectId)
    const query = {
      [mongoose.Types.ObjectId.isValid(req.params.id) ? '_id' : '_hid']: req.params.id,
    };

    // Note that if no doc is found, both err & doc are null.
    Model.findByIdAndUpdate(query, _.omit(req.body, '_id', '__v'), { new: true }, (err, doc) => {
      if (err) return void next(err);

      res.locals[singular] = doc.toJSON();

      next();
    });
  }

  return {
    create,
    findById,
    getAll,
    query,
    remove,
    replace,
    update,
  };
};
