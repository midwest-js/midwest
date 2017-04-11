'use strict';

const _ = require('lodash');

const { columns: sqlColumns, where } = require('../util/sql');

const factories = {
  count(db, table) {
    return function count(json) {
      let query = `SELECT count(id) FROM ${table}`;

      let values;

      if (Object.keys(json).length) {
        query += ` WHERE ${where(json)}`;
        values = _.values(_.omitBy(json, _.isNil));
      }

      query += ';';

      return db.one(query, values).then((result) => {
        return parseInt(result.count, 10)
      });
    };
  },

  create(db, table, columns, emitter) {
    const columnsString = sqlColumns(columns);

    return function create(json) {
      json = _.pickBy(json, (value, key) => !_.isUndefined(value) && columns.includes(key));

      const keys = _.keys(json).map((key) => `"${_.snakeCase(key)}"`);
      const values = _.values(json);

      const query = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${values.map((v, i) => `$${i + 1}`).join(', ')}) RETURNING ${columnsString};`;

      return db.one(query, values).then((result) => {
        if (emitter) emitter.emit('db', table);

        return result;
      });
    };
  },

  // use req.query to query database.
  // should probably be used with `midwest/middleware/format-query` and/or
  // `midwest/middleware/paginate`
  find(db, table, columns, emitter, defaults = {}) {
    const columnsString = sqlColumns(columns);

    return function find(json) {
      const {
        offset = defaults.offset,
        limit = defaults.limit,
        sort = defaults.sort,
      } = json;

      json = _.omit(json, 'limit', 'sort', 'offset');

      let q = `SELECT ${columnsString} FROM ${table}`;

      if (Object.keys(json).length) {
        q += ` WHERE ${where(json)}`;
      }

      if (sort) {
        q += ` ORDER BY ${sort}`;
      } else {
        q += ' ORDER BY id DESC';
      }

      if (limit) {
        q += ` LIMIT ${limit} OFFSET ${offset}`;
      }

      q += ';';

      const values = _.values(_.omitBy(json, _.isNil));

      return db.manyOrNone(q, values);
    };
  },


  findById(db, table, columns) {
    columns = sqlColumns(columns);

    return function findById(id, cb) {
      if (id === 'new') return cb();

      const query = `SELECT ${columns} FROM ${table} WHERE id = $1;`;

      return db.oneOrNone(query, [id]);
    };
  },

  findOne(db, table, columns) {
    columns = sqlColumns(columns);

    return function find(json) {
      const query = `SELECT ${columns} FROM ${table} WHERE ${where(json)} LIMIT 1;`;

      const values = _.values(_.omitBy(json, _.isNil));

      return db.oneOrNone(query, values);
    };
  },

  getAll(db, table, columns) {
    columns = sqlColumns(columns);

    const query = `SELECT ${columns} FROM ${table} ORDER BY id DESC;`;

    return function getAll() {
      return db.many(query);
    };
  },

  remove(db, table, columns, emitter) {
    const query = `DELETE FROM ${table} WHERE id = $1;`;

    return function remove(id) {
      db.query(query, [id]).then((result) => {
        if (emitter) emitter.emit('db', table);

        return result.rowCount;
      });
    };
  },

  // completely replaces the doc
  // SHOULD be used with PUT
  replace(db, table, columns, emitter) {
        // _.difference(columns, _.keys(json)).forEach((key) => {
        //   json[key] = null;
        // });
    return this.update(db, table, columns, emitter);
  },

  update(db, table, columns, emitter) {
    const columnsString = sqlColumns(columns);

    // changes properties passed on req.body
    // SHOULD be used with PATCH
    return function update(id, json) {
      // enable using using _hid (not that _id MUST be a ObjectId)

      json = _.pickBy(json, (value, key) => columns.includes(key));

      const keys = _.keys(json).map((key) => `"${_.snakeCase(key)}"`);
      const values = _.values(json);

      const query = `UPDATE ${table} SET ${keys.map((key, i) => `${key}=$${i + 1}`).join(', ')} WHERE id = $${keys.length + 1} RETURNING ${columnsString};`;

      return db.one(query, [...values, id]).then((result) => {
        if (emitter) emitter.emit('db', table);

        return result;
      });
    };
  },
};

const all = Object.keys(factories);

module.exports = ({ defaults, db, emitter, table, columns, exclude, include }) => {
  include = include || _.difference(all, exclude);

  return include.reduce((result, value) => {
    if (factories[value]) {
      result[value] = factories[value](db, table, columns, emitter, defaults && Object.assign({}, defaults.all, defaults[value]));
    }

    return result;
  }, {});
};

Object.assign(module.exports, factories);
