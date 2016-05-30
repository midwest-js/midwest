'use strict';

const p = require('path');
const fs = require('fs');

const fileName = p.join(process.cwd(), 'server/config/languages.js');

let languages;

if (fs.existsSync(fileName)) {
  languages = _.map(require(fileName), (val) => val);
}

module.exports = function (req, res, next) {
  res.locals.languages = languages;

  next();
};
