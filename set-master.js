'use strict';

module.exports = function (master) {
	return function setMaster(req, res, next) {
		res.master = master;
		next();
	};
};
