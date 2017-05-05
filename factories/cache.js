'use strict';

module.exports = {
  init(caches = {}, allowQuery = false) {
    return (req, res, next) => {
      const [ , query ] = req.originalUrl.split('?');

      if (allowQuery || !query) {
        let cache = caches[req.originalUrl];

        if (!cache) {
          cache = caches[req.originalUrl] = {};
        }

        res.cache = cache;

        if (cache.locals) {
          res.locals = Object.assign({}, cache.locals);

          return next('route');
        }
      }

      next();
    };
  },

  store(req, res, next) {
    if (res.cache) {
      res.cache.locals = Object.assign({}, res.locals);
    }

    next();
  },
};
