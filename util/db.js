'use strict';

const pg = require('pg');
const _ = require('lodash');

// this is the right way to export the query method
module.exports = (conf) => {
  const pool = new pg.Pool(conf);
  
  return {
    query(...args) {
      pool.query(...args);
    },

    connect(cb) {
      pool.connect(cb);
    },

    begin(cb) {
      pool.connect((err, client, done) => {
        if (err) return cb(err);

        const instance = transaction(client);

        pool.query('BEGIN;', (err) => {
          if (err) {
            instance.rollback(() => {
              cb(err);
            });
          } else {
            cb(null, instance);
          }
        });
      });
    },
  };
};

function transaction(client, done) {
  return {
    commit(cb) {
      client.query('COMMIT;', (err) => {
        if (err) {
          this.rollback(() => cb(err));
        } else {
          cb();
        }
      });
    },

    rollback(cb) {
      client.query('ROLLBACK;', (err) => {
        // if there was a problem rolling back the query
        // something is seriously messed up.  Return the error
        // to the done function to close & remove this client from
        // the pool.  If you leave a client in the pool with an unaborted
        // transaction weird, hard to diagnose problems might happen.

        if (err) done(err);
      });
    },

    query(query, values, cb) {
      if (typeof values === 'function') {
        cb = values;
        values = null;
      }

      client.query(query, values, (err, result) => {
        if (err) {
          this.rollback((rollbackErr) => {
            cb(err);
          });
        } else {
          cb(null, result);
        }
      });
    },
  };
}
