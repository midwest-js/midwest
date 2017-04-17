'use strict';

module.exports = {
  one(result) {
    return result.rows ? result.rows[0] : undefined;
  },

  many(result) {
    return result.rows ? result.rows : [];
  },
};
