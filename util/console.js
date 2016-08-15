'use strict'

const chalk = require('chalk')

console._log = console.log
console._dir = console.dir

function extractLocation() {
  const obj = {}
  Error.captureStackTrace(obj)
  const str = obj.stack.split(/\n\s*/)[3]

  const cwd = process.cwd()

  if (str.includes(cwd))
    return str.slice(str.indexOf(cwd) + cwd.length, -1)

  return str.slice(str.indexOf('/'), -1)
}

console.log = function (...args) {
  console._log(chalk.grey(extractLocation()))
  console._log(...args)
}

console.dir = function (obj, options) {
  console._log(chalk.grey(extractLocation()))
  this._dir(obj, Object.assign({
    colors: true
  }, options))
}
