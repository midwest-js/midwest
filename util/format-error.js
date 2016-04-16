'use strict';

// modules > native
const http = require('http');

// modules > 3rd party
const _ = require('lodash');
const debug = require('debug')('warepot:errorHandler');

const fileLocationPattern = new RegExp(process.cwd() + '\\/([\\/\\w-_\\.]+\\.js):(\\d*):(\\d*)');

function parseFileLocation(stack) {
  if (_.isString(stack))
    return _.zipObject(['fileName', 'lineNumber', 'columnNumber'],
      _.tail(stack.match(fileLocationPattern)));
}

module.exports = function (error, req) {
  // pick all important properties on Error prototype and any
  // own properties
  let err = _.pick(error, [ 'stack', 'message', 'name' ].concat(_.keys(error)));

  debug('unformatted error: ' + JSON.stringify(error, null, '\t'));

  err.status = err.status || 500;
  err.statusText = http.STATUS_CODES[err.status];

  if (req) {
    _.assignIn(err, {
      path: req.path,
      method: req.method,
      ip: req.ip,
      user: req.user && req.user.id,
      userAgent: req.headers['user-agent']
    });

    err.xhr = req.xhr;

    if (!_.isEmpty(req.body)) err.body = req.body;
    if (!_.isEmpty(req.query)) err.query = req.query;
  }

  if (error.name === 'ValidationError') {
    err.status = 422;

    err.errors = _.map(error.errors, 'message');
  }

  if (err.status >= 500) {
    _.defaults(err, parseFileLocation(err.stack));
  } else {
    delete err.stack;
  }

  // sort properties by name
  err = _.fromPairs(_.sortBy(_.toPairs(err), function (pair) {
    return pair[0];
  }));

  debug('formatted error: ' + JSON.stringify(err, null, '\t'));

  return err;
};
