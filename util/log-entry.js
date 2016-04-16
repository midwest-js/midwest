'use strict';

// modules > native
const p = require('path');

// modules > 3rd party
const chalk = require('chalk');

// string added to all errors logged to console
const prefix = '[' + chalk.blue('LL') + ']: ';

const _config = require(p.join(process.cwd(), 'server/config/logger'));

const logError = require('./log-error');

const LogEntry = require('../models/log-entry');

module.exports = function logEntry(message, req, config) {
  config = _.defaults(config || {}, _config);

  const date = new Date();

  if (config.console) {
    console.log(prefix + '[' + chalk.cyan(date) + '] ' + message);
  }

  if (config.database) {
    LogEntry.create({
      dateCreated: date,
      message: message,
      user: req && req.user && req.user.id
    }, function (err) {
      // TODO handle errors in error handler better
      if (err) {
        logError(err);
      }
    });
  }
};
