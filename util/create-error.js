'use strict'

const _ = require('lodash')

module.exports = function createError (message, status) {
  let props
  let ErrorConstructor = Error

  if (_.isPlainObject(message)) {
    props = _.omit(message, 'message')

    if (message.errorConstructor) {
      ErrorConstructor = props.errorConstructor
    }

    message = message.message || 'Error'
  } else {
    props = {}
  }

  if (_.isPlainObject(status)) {
    Object.assign(props, status)
  } else if (typeof status === 'number') {
    props.status = status
  }

  const err = new ErrorConstructor(message)

  Object.assign(err, props)

  return err
}
