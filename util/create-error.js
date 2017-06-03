'use strict'

module.exports = function createError (message, status) {
  const err = new Error(message)

  err.status = status

  return err
}
