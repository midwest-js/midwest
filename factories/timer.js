'use strict';

const _ = require('lodash');
const chalk = require('chalk');

function print(result, identifier) {
  console.info(chalk.green('timer: ') + _.padEnd(_.truncate(`[${identifier}]`, { length: 24 }), 25) + chalk.green.bold(result[0] * 1e3 + result[1] / 1e6 + ' ms'));
}

module.exports = (mw, identifier = mw.name || 'anonymous') => (req, res, next) => {
  res.___send = res.___send || res.send;

  res.send = (...args) => {
    print(process.hrtime(start), identifier);

    res.___send(...args);
  }

  const _next = (...args) => {
    print(process.hrtime(start), identifier);

    next(...args);
  };

  const start = process.hrtime();

  mw(req, res, _next);
};
