'use strict';

const p = require('path');
const fs = require('fs');
const minify = require('pg-minify');

module.exports = function requireSql(file, relative) {
  const fullPath = relative ? p.join(relative, file) : file;

  const result = fs.readFileSync(fullPath, { encoding: 'utf8' });

  return minify(result);
};
