'use strict';

const _ = require('lodash');

function isNotNil(value) {
  return !_.isNil(value);
}

module.exports = (validation) => function validate(attrs) {
  const errors = [];

  _.each(validation, (tests, key) => {
    if (tests === true) tests = [ isNotNil ];
    else if (!Array.isArray(tests)) tests = [ tests ];

    const value = _.get(attrs, key);

    if (value == null || !tests.every((test) => test(value))) {
      errors.push(key);
    }
  });

  return errors;
};

