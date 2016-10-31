'use strict';

// modules > 3rd party
const _ = require('lodash');
const ua = require('useragent');

module.exports = function (config) {
  config = config || require('./example/config/shim');

  const allShims = [];
  // returns { family: [[ url, operator, majorVersion ]] }
  const allTests = _.reduce(config, (result, value, key) => {
    value.forEach((str) => {
      const arr = str.split(' ');

      const family = arr.slice(0, -2).join(' ');

      const [operator, major] = arr.slice(-2);

      if (!result[family]) {
        result[family] = [];
      }

      allShims.push(key);

      result[family].push([key, operator, parseInt(major, 10)]);
    });

    return result;
  }, {});

  return function shim(req, res, next) {
    if (req.xhr || req.accepts(['json', '*/*']) === 'json') return next();

    const { family, major } = ua.parse(req.headers['user-agent']);

    const tests = allTests[family.toLowerCase()];

    if (tests) {
      const scripts = [];

      for (let i = 0; i < tests.length; i += 1) {
        const test = tests[i];

        switch (test[1]) {
          case '<':
            if (major < test[2]) scripts.push(test[0]);
            break;
          case '<=':
            if (major <= test[2]) scripts.push(test[0]);
            break;
          case '>':
            if (major > test[2]) scripts.push(test[0]);
            break;
          case '>=':
            if (major >= test[2]) scripts.push(test[0]);
            break;
          case '==':
          case '===':
            if (major === test[2]) scripts.push(test[0]);
            break;
          case '!=':
          case '!==':
            if (major !== test[2]) scripts.push(test[0]);
            break;
          default:
            throw new Error('Invalid operator');
        }
      }

      if (scripts.length) {
        res.locals.scripts = scripts;
      }
    } else {
      res.locals.scripts = allShims;
    }


    next();
  };
};
