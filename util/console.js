/* eslint-disable no-console */

'use strict';

const chalk = require('chalk');

console.originalLog = console.log;
console.originalDir = console.dir;

function extractLocation() {
  const obj = {};
  Error.captureStackTrace(obj);
  const str = obj.stack.split(/\n\s*/)[3];

  const cwd = process.cwd();

  if (str.includes(cwd)) {
    return str.slice(str.indexOf(cwd) + cwd.length + 1, -1);
  }

  return str.slice(str.indexOf('(') + 1, -1);
}

console.log = function (...args) {
  console.originalLog(chalk.grey(extractLocation()));
  console.originalLog(...args);
};

console.dir = function (obj, options) {
  console.originalLog(chalk.grey(extractLocation()));
  this.originalDir(obj, Object.assign({
    colors: true,
  }, options));
};
