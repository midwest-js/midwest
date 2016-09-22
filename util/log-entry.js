/*
 * Module that logs log entries to console
 * and/or database.
 *
 * This module expects a config file located
 * at `server/config/logger`.
 *
 * @module midwest/util/log-entry
 */

'use strict';

// modules > native
const p = require('path');

// modules > 3rd party
const _ = require('lodash');
const chalk = require('chalk');

// string added to all errors logged to console
const prefix = `[${chalk.blue('LL')}]: `;

const _config = require(p.join(process.cwd(), 'server/config/logger'));

const logError = require('./log-error');

const LogEntry = require('mongopot/models/log-entry');

/*
 * @param {string} message - The message to be logged
 * @param {IncomingMessage} req - The request object. Is needed to collected
 * data about the request
 * @param {Object} config - Optional config object to override the default
 * config on a per log basis.
 */
module.exports = function logEntry(message, req, config) {
  config = _.defaults(config || {}, _config);

  const date = new Date();

  if (config.console) {
    console.info(`${prefix}[${chalk.cyan(date)}] ${message}`);
  }

  if (config.database) {
    LogEntry.create({
      dateCreated: date,
      message,
      user: req && req.user && req.user.id,
    }, (err) => {
      // TODO handle errors in error handler better
      if (err) {
        logError(err);
      }
    });
  }
};
