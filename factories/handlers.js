'use strict';

const p = require('path');

const _ = require('lodash');

const db = require(p.join(PWD, 'server/db'));

const { columns: sqlColumns, where } = require('../util/sql');

const factories = {
  count(table) {
    return function count(json, cb) {
      let query = `SELECT count(id) FROM ${table}`;

      let values;

      if (Object.keys(json).length) {
        query += ` WHERE ${where(json)}`;
        values = _.values(_.omitBy(json, _.isNil));
      }

      query += ';';


      db.query(query, values, (err, result) => {
        if (err) return cb(err);

        cb(null, parseInt(result.rows[0].count, 10));
      });
    };
  },

  create(table, columns) {
    const columnsString = sqlColumns(columns);

    return function create(json, cb) {
      json = _.pickBy(json, (value, key) => !_.isUndefined(value) && columns.includes(key));

      const keys = _.keys(json).map((key) => `"${_.snakeCase(key)}"`);
      const values = _.values(json);

      const query = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${values.map((v, i) => `$${i + 1}`).join(', ')}) RETURNING ${columnsString};`;

      db.query(query, values, (err, result) => {
        if (err) return cb(err);

        return cb(null, result.rows[0]);
      });
    };
  },

  // use req.query to query database.
  // should probably be used with `midwest/middleware/format-query` and/or
  // `midwest/middleware/paginate`
  find(table, columns, query) {
    columns = sqlColumns(columns);

    return function find(json, cb) {
      const page = Math.max(0, json.page);
      const perPage = Math.max(0, json.limit);

      json = _.omit(json, 'limit', 'sort', 'page');

      let q;

      if (query) {
        if (_.isFunction(query)) {
          q = query(json);
        }
      } else {
        q = `SELECT ${columns} FROM ${table}`;

        if (Object.keys(json).length) {
          q += ` WHERE ${where(json)}`;
        }

        if (json.sort) {
          q += ` ORDER BY ${json.sort}`;
        } else {
          q += ' ORDER BY id DESC';
        }

        if (perPage) {
          q += ` LIMIT ${perPage} OFFSET ${perPage * page}`;
        }

        q += ';';
      }

      const values = _.values(_.omitBy(json, _.isNil));

      db.query(q, values, (err, result) => {
        if (err) return cb(err);

        cb(null, result.rows);
      });
    };
  },


  findById(table, columns) {
    columns = sqlColumns(columns);

    return function findById(id, cb) {
      if (id === 'new') return cb();

      const query = `SELECT ${columns} FROM ${table} WHERE id = $1;`;

      db.query(query, [id], (err, result) => {
        if (err) return cb(err);

        cb(null, result.rows[0]);
      });
    };
  },

  findOne(table, columns) {
    columns = sqlColumns(columns);

    return function find(json, cb) {
      const query = `SELECT ${columns} FROM ${table} WHERE ${where(json)} LIMIT 1;`;

      const values = _.values(_.omitBy(json, _.isNil));

      db.query(query, values, (err, result) => {
        if (err) return cb(err);

        cb(null, result.rows[0]);
      });
    };
  },

  getAll(table, columns) {
    columns = sqlColumns(columns);

    const query = `SELECT ${columns} FROM ${table} ORDER BY id DESC;`;

    return function getAll(cb) {
      db.query(query, (err, result) => {
        if (err) return cb(err);

        cb(null, result.rows);
      });
    };
  },

  remove(table) {
    const query = `DELETE FROM ${table} WHERE id = $1;`;

    return function remove(id, cb) {
      db.query(query, [id], (err, result) => {
        if (err) return cb(err);

        cb(null, result.rowCount);
      });
    };
  },

  // completely replaces the doc
  // SHOULD be used with PUT
  replace(table, columns) {
    return this.update(table, columns, true);
  },

  update(table, columns, replace) {
    const columnsString = sqlColumns(columns);

    // changes properties passed on req.body
    // SHOULD be used with PATCH
    return function update(id, json, cb) {
      // enable using using _hid (not that _id MUST be a ObjectId)

      json = _.pickBy(json, (value, key) => columns.includes(key));

      if (replace) {
        _.difference(columns, _.keys(json)).forEach((key) => {
          json[key] = null;
        });
      }

      const keys = _.keys(json).map((key) => `"${_.snakeCase(key)}"`);
      const values = _.values(json);

      const query = `UPDATE ${table} SET ${keys.map((key, i) => `${key}=$${i + 1}`).join(', ')} WHERE id = $${keys.length + 1} RETURNING ${columnsString};`;

      db.query(query, [...values, id], (err, result) => {
        if (err) return cb(err);

        cb(null, result.rows[0]);
      });
    };
  },
};

const all = Object.keys(factories);

module.exports = ({ table, columns, exclude, include }) => {
  include = include || _.difference(all, exclude);

  return include.reduce((result, value) => {
    if (factories[value]) {
      result[value] = factories[value](table, columns);
    }

    return result;
  }, {});
};
