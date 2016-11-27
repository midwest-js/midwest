'use strict';

const _ = require('lodash');

module.exports = {
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
};
