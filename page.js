'use strict';

const _ = require('lodash');

module.exports = function (page, navigation) {
	return Object.defineProperty(function (req, res, next) {
		res.locals.page = _.defaults({
			routePath: page.path,
			path: req.path
		}, page);

		if (!req.xhr) {
			res.locals.user = req.user;
			res.locals.navigation = navigation;
		}

		next();
	}, 'name', { value: 'page' });
};
