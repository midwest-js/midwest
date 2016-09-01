'use strict'

const _ = require('lodash')

const errorTemplate = require('path/to/template.marko')

const defaults = {
  post: (req, res, next) => {
    res.template = errorTemplate

    next()
  },

  mystify: {
    properties: ['errors', 'message', 'name', 'status', 'statusText']
  },

  log: {
    // if database = true there has to be a mongoose model name ErrorModel
    ignore: [],
  }
}

const ErrorModel = require('path/to/error-model')

function store(error) {
  ErrorModel.create(error, (err) => {
    // TODO handle errors in error handler better
    if (err) {
      console.error('ERROR WRITING TO DATABASE')
      console.error(err)
      console.log(err.errors)
      console.error('ORIGINAL ERROR')
      console.error(error)
    }
  })
}

module.exports = _.merge(defaults, {
  development: {
    log: {
      store: false,
      console: true,
    }
  },
  testing: {
    log: {
      store: false,
      console: false,
    },
  },
  staging: {
    log: {
      store: store,
      console: true,
    }
  },
  production: {
    log: {
      store: store,
      console: false,
    }
  },
}[ENV])
