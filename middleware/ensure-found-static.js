'use strict'

const regex = /\.[a-zA-Z]{1,4}$/

module.exports = function ensureFoundStatic (req, res, next) {
  if (regex.test(req.path)) {
    const err = new Error(`Not found: ${req.method.toUpperCase()} ${req.path}`)

    err.status = 404

    next(err)
  } else {
    next()
  }
}
