/*
 * Formats errors
 *
 * @module midwest/util/format-error
 */

'use strict'

// modules > native
const http = require('http')

// modules > 3rd party
const _ = require('lodash')
const debug = require('debug')('midwest:errorHandler')

const fileLocationPattern = new RegExp(`${process.cwd()}\\/([\\/\\w-_\\.]+\\.js):(\\d*):(\\d*)`)

/*
 * @private
 */
function parseFileLocation (stack) {
  if (_.isString(stack)) {
    return _.zipObject(['filename', 'lineNumber', 'columnNumber'],
      _.tail(stack.match(fileLocationPattern)))
  }
}

const allowedProperties = [
  'id',
  'body',
  'columnNumber',
  'createdAt',
  'description',
  'details',
  'filename',
  'ip',
  'lineNumber',
  'method',
  'message',
  'name',
  'path',
  'query',
  'session',
  'stack',
  'status',
  'statusText',
  'userId',
  'userAgent',
  'xhr'
]

/*
 * Formats an error and converts it to a plain object.
 *
 * @param {Error} error - Error to be logged
 * @param {IncomingMessage} req - Request object of current request.
 * Used to add additional info to error such as logged in user.
 *
 * @returns The formatted error as a plain object.
 */
module.exports = function formatError (error, req) {
  let err = _.pick(error, allowedProperties)

  const nonStandardProperties = _.difference(Object.keys(error), allowedProperties)

  if (nonStandardProperties.length) {
    // set any properties not in `allowedProperties` in details
    err.details = Object.assign({}, err.details, _.pick(error, nonStandardProperties))
  }

  debug(`unformatted error: ${JSON.stringify(error, null, '\t')}`)

  err.status = err.status || 500
  err.statusText = http.STATUS_CODES[err.status]

  if (req) {
    _.assign(err, {
      path: req.path,
      method: req.method,
      ip: req.ip,
      user_id: req.user && req.user.id,
      userAgent: req.headers['user-agent']
    })

    err.xhr = req.xhr

    // We mapKeys because Mongo does not allow keys with dots stored to DB.
    if (!_.isEmpty(req.body)) err.body = _.mapKeys(req.body, (value, key) => key.replace('.', 'DOT'))
    if (!_.isEmpty(req.query)) err.query = req.query
  }

  if (error.name === 'ValidationError') {
    err.status = 422

    err.details = _.assignIn(err.details, { validationErrors: _.map(error.errors, 'message') })

    delete err.errors
  }

  if (err.status >= 500) {
    // use defaults in case any of the location props are already set
    _.defaults(err, parseFileLocation(err.stack))
  } else {
    delete err.stack
  }

  // sort properties by name
  err = _.fromPairs(_.sortBy(_.toPairs(err), (pair) => pair[0]))

  debug(`formatted error: ${JSON.stringify(err, null, '\t')}`)

  return err
}
