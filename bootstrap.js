/*
 * Simple middleware that saves res.locals as stringified JSON to
 * `res.locals.INITIAL_STATE` and app.locals to `res.locals.INITIAL_CONTEXT`.
 *
 * @module warepot/bootstrap
 */

'use strict';

const _ = require('lodash');

module.exports = function (req, res, next) {
  if (!req.xhr) {
    res.locals.INITIAL_STATE = JSON.stringify(_.extend({
      id: decodeURI(req.originalUrl),
    }, _.omit(res.locals, 'query', 'navigation')));

    res.locals.INITIAL_CONTEXT = JSON.stringify(_.extend({}, _.pick(res.locals, 'navigation'), _.pick(res.app.locals, 'organization', 'site')));
  }

  next();
};

