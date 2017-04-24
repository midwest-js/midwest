'use strict';

const _ = require('lodash');

module.exports = function parseRoutes(routes, tree = []) {
  return _.reduce(routes, (result, value, key) => {
    const path = tree.concat(key.slice(1).split('/').filter((value) => !!value));

    const obj = Object.assign({
      path: `/${path.join('/')}`,
    }, _.omit(value, 'routes'));

    result.push(obj);

    if (value.routes) {
      result.push(...parseRoutes(value.routes, path));
    }

    return result;
  }, []);
};
