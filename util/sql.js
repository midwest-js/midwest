'use strict';

const _ = require('lodash');

module.exports = {
  columns(array, table) {
    return array.map((column) => {
      const snakeCase = _.snakeCase(column);

      let str = '';

      if (snakeCase !== column) {
        str += `${_.snakeCase(column)} as "${column}"`;
      } else {
        str += column;
      }

      if (table) {
        str = `${table}.${str}`;
      }

      return str;
    }).join(', ');
  },

  where(json, table) {
    const entries = _.entries(json);

    return entries.map(([key, value], i) => {
      key = _.snakeCase(key);

      if (table) key = `${table}.${key}`;

      if (value === null) {
        return `${key} IS NULL`;
      }

      return `${key} = $${i + 1}`;
    }).join(' AND ');
  },

  values(json) {
    return _.values(_.omitBy(json, _.isNil));
  },
};
