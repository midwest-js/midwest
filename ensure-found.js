'use strict';

const _ = require('lodash');

module.exports = function ensureFound(req, res, next) {
  if (res.template || _.some(res.locals)) {
    next();
  } else {
    // generates Not Found error if there is no page to render and no truthy values in data
    const err = new Error('Not found: ' + req.path);
    err.status = 404;
    next(err);
  }
};
