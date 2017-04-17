'use strict';

const _ = require('lodash');

module.exports = {
  as(array, table) {
    return array.map((column) => {
      const snakeCase = _.snakeCase(column);

      if (snakeCase !== column) {
        return `${table ? `${table}.${snakeCase}` : snakeCase} as "${column}"`;
      }

      return column;
    });
  },

  columns(array, table) {
    return array.map((column) => {
      if (Array.isArray(column)) {
        return `${column[0]} as ${[column[1]]}`;
      }

      const snakeCase = _.snakeCase(column);

      let str = '';

      if (snakeCase !== column) {
        str += `${snakeCase} as "${column}"`;
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
      } else if (Array.isArray(value)) {
        if (typeof value[0] === 'number') {
          return `${key} BETWEEN ($${i + 1}::int[])[1] AND ($${i + 1}::int[])[2]`;
        }

        return `${key} @> $${i + 1}::text[]`;
      }

      return `${key} = $${i + 1}`;
    }).join(' AND ');
  },

  values(json) {
    return _.values(_.omitBy(json, _.isNil));
  },
};
