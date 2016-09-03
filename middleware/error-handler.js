/*
 * Error handling middleware
 *
 * @see module:warepot/util/format-error
 * @see module:warepot/util/log-error
 */
'use strict'

// modules > native
const p = require('path')

// modules > 3rd party
const _ = require('lodash')

// modules > internal
const format = require('../util/format-error')
const log = require('../util/log-error')

const config = require(p.join(PWD, 'server/config/error-handler'))

module.exports = function errorHandler(error, req, res, next) {
  error = format(error, req)

  log(error, req, { format: false })

  // limit what properties are sent to the client by overriding toJSON().
  if (req.isAdmin && !req.isAdmin())
    error.toJSON = function () {
      return _.pick(this, config.mystify.properties)
    }

  res.status(error.status).locals = { error }

  if (config.post)
    config.post(req, res, next)
  else
    next()
}
