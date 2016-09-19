'use strict'

const _ = require('lodash')
const mongoose = require('mongoose')

module.exports = (Model) => {
  const singular = _.camelCase(Model.modelName)
  // TODO
  // this will probably give all lowercase for multiple word collections
  // eg newsArticles will probably be newsarticles
  const plural = Model.collection.name

  function create(req, res, next) {
    Model.create(req.body, (err, doc) => {
      if (err) return next(err)

      res.set('Location', req.url + '/' + doc._id)
        .status(201)
        .locals[singular] = doc

      return next()
    })
  }

  function findById(req, res, next) {
    if (req.params.id === 'new') return next()

    Model.findOne({ _id: req.params.id }).lean().exec((err, doc) => {
      if (err) return next(err)

      res.locals[singular] = doc

      return next()
    })
  }

  function getAll(req, res, next) {
    Model.find({}).sort('name').exec((err, docs) => {
      res.locals[plural] = docs

      next(err)
    })
  }

  // use req.query to query database.
  // should probably be used with `midwest/middleware/format-query` and/or
  // `midwest/middleware/paginate`
  function query(req, res, next) {
    const page = Math.max(0, req.query.page) || 0
    const perPage = Math.max(0, req.query.limit) || res.locals.perPage

    const query = Model.find(_.omit(req.query, 'limit', 'sort', 'page'),
      null,
      { sort: req.query.sort || '-_id', lean: true })

    if (perPage)
      query.limit(perPage).skip(perPage * page)

    query.exec(function (err, docs) {
      res.locals[plural] = docs
      next(err)
    })
  }

  function remove(req, res, next) {
    Model.remove({ _id: req.params.id }, (err, obj) => {
      if (err) return next(err)

      if (obj.result.n > 0)
        res.status(204)

      next()
    })
  }

  // completely replaces the doc
  // SHOULD be used with PUT
  function replace(req, res, next) {
    // enable using using _hid (not that _id MUST be a ObjectId)
    const query = {
      [mongoose.Types.ObjectId.isValid(req.params.id) ? '_id' : '_hid']: req.params.id
    }

    // Note that if no doc is found, both err & doc are null.
    Model.findByIdAndUpdate(query, _.omit(req.body, '_id', '__v'), { new: true, overwrite: true }, (err, doc) => {
      if (err) return next(err)

      res.locals[singular] = doc

      next()
    })
  }

  // changes properties passed on req.body
  // SHOULD be used with PATCH
  function update(req, res, next) {
    // enable using using _hid (not that _id MUST be a ObjectId)
    const query = {
      [mongoose.Types.ObjectId.isValid(req.params.id) ? '_id' : '_hid']: req.params.id
    }

    // Note that if no doc is found, both err & doc are null.
    Model.findByIdAndUpdate(query, _.omit(req.body, '_id', '__v'), { new: true }, (err, doc) => {
      if (err) return next(err)

      res.locals[singular] = doc

      next()
    })
  }

  return {
    create,
    findById,
    getAll,
    query,
    remove,
    replace,
    update
  }
}
