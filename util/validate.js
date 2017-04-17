'use strict';

const _ = require('lodash');

function isNotNil(value) {
  return !_.isNil(value);
}

module.exports = (validation) => function validate(attrs) {
  const errors = [];

  _.each(validation, (tests, key) => {
    if (tests === true) tests = [isNotNil];
    else if (!Array.isArray(tests)) tests = [tests];

    if (!tests.every((test) => test(_.get(attrs, key)))) {
      errors.push(key);
    }
  });

  return errors;
};

