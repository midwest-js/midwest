'use strict'

const _ = require('lodash')

module.exports = (mw) => function parallel (req, res, next) {
  // TODO handle errors
  next = _.after(mw.length, next)

  mw.forEach((mw) => mw(req, res, next))
}
