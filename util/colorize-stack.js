/*
 * Handy little util function that highlights all files in the stack trace not
 * in the node_modules/ folder.
 *
 * Copied from warepot/util/colorize-stack (commit 86b66ea37abc0ecba43c39381ada76b2a0bffe67)
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
module.exports = function (stack, html) {
  if (!stack) return

  return stack.replace(/\/[\/\w.-]+/g, (match) => {
    if (match.indexOf('node_modules') > -1)
      return match

    const dir = p.dirname(process.cwd())
    const index = match.indexOf(dir)

    if (index > -1) {
      const endIndex = index + dir.length

      if (html)
        return match.slice(0, endIndex) + match.slice(endIndex).bold()

      return match.slice(0, endIndex) + chalk.yellow(match.slice(endIndex))
    }

    if (html)
      return match.bold()

    return chalk.yellow(match)
  })
}
