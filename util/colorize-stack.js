/*
 * Handy little util function that highlights all files in the stack trace not
 * in the node_modules/ folder.
 *
 * @module warepot/util/colorize-stack
 */
'use strict'

// modules > native
const p = require('path')

// modules > 3rd party
const chalk = require('chalk')

/*
 * Colorizes a stack trace.
 *
 * {String} - String
 *
 * @returns A colored string of the stack trace
 */
module.exports = function (stack) {
  if (!stack) return

  stack = stack.replace(/\/[\/\w.-]+/g, function (match) {
    if (match.indexOf('node_modules') > -1)
      return match

    const dir = p.dirname(process.cwd())
    const index = match.indexOf(dir)

    if (index > -1) {
      const endIndex = index + dir.length
      return match.slice(0, endIndex) + chalk.yellow(match.slice(endIndex))
    }

    return chalk.yellow(match)
  })

  return stack
}
