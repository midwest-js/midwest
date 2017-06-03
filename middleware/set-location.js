'use strict'

const getLocation = require('../util/get-location')

module.exports = function setLocation (req, res, next) {
  res.locals.location = getLocation(req)

  next()
}
