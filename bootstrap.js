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

