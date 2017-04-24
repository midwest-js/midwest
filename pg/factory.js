'use strict';

const pg = require('pg');

function transaction(client) {
  return {
    commit() {
      return client.query('COMMIT;').then(() => {
        client.release();
      }).catch((err) => this.rollback().then(() => {
        throw err;
      }));
    },

    rollback() {
      return client.query('ROLLBACK;').then(() => {
        // if there was a problem rolling back the query
        // something is seriously messed up.  Return the error
        // to the done function to close & remove this client from
        // the pool.  If you leave a client in the pool with an unaborted
        // transaction weird, hard to diagnose problems might happen.

        client.release();
      });
    },

    query(...args) {
      return client.query(...args)
        .catch((err) => this.rollback().then(() => {
          throw err;
        }));
    },
  };
}

module.exports = (conf) => {
  const pool = (conf instanceof pg.Pool) ? conf : new pg.Pool(conf);

  return {
    end(...args) {
      return pool.end(...args);
    },

    query(...args) {
      return pool.query(...args);
    },

    connect(...args) {
      return pool.connect(...args);
    },

    begin() {
      return pool.connect().then((client) => {
        const t = transaction(client);

        return t.query('BEGIN;')
          .then(() => t)
          .catch((err) => t.rollback().then(() => {
            throw err;
          }));
      });
    },
  };
};
