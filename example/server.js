'use strict';

/*
 * The main file that sets up the Express instance and node
 *
 * @module server/server
 * @type {Express instance}
 */

// set up some globals (these are also set in Epiphany if not already set)
global.ENV = process.env.NODE_ENV || 'development';
global.PWD = process.env.NODE_PWD || process.cwd();

// output filename in console log and colour console.dir
if (ENV === 'development') {
  require('midwest/util/console');
}

// make node understand `*.jsx` files
require('jsx-node/node-require').install();

// modules > native
const p = require('path');

// modules > 3rd party
const _ = require('lodash');
const chalk = require('chalk');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const requireDir = require('require-dir');

// modules > express middlewares
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');

// modules > midwest
const colorizeStack = require('midwest/util/colorize-stack');

const config = requireDir('./config');

// make error output stack pretty
process.on('uncaughtException', (err) => {
  console.error(chalk.red('UNCAUGHT EXCEPTION'));
  if (err.stack) {
    console.error(colorizeStack(err.stack));
  } else {
    console.error(err);
  }
  process.exit(1);
});

const prewares = [
  express.static(config.dir.static, ENV === 'production' ? { maxAge: '1 year' } : null),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  cookieParser(),
  session(config.session),
  passport.initialize(),
  passport.session(),
];

if (ENV === 'development') {
  // only log requests to console in development mode
  prewares.unshift(require('morgan')('dev'));
  // automatically login global.LOGIN_USER
  prewares.push(require('midwest-module-membership/passport/automatic-login'));
}

const postwares = [
  require('midwest/middleware/ensure-found'),
  // transform and log error
  require('midwest/middleware/error-handler'),
  // respond
  require('midwest/middleware/responder'),
];

const server = express();

// get IP & whatnot from nginx proxy
server.set('trust proxy', true);

Object.assign(server.locals, {
  site: require('./config/site'),
});

// override default response render method for
// more convenient use with JSX files (only "dump" components)
server.response.render = function (template) {
  const locals = Object.assign({}, server.locals, this.locals);

  this.send(template(locals));
};

try {
  server.locals.js = require(p.join(PWD, 'public/js.json'));
} catch (e) {}

try {
  server.locals.css = require(p.join(PWD, 'public/css.json'));
} catch (e) {}

// load all prewares
server.use(...prewares);

// routes > pages
server.use(require('./pages'));

// routes > authentication
server.use('/auth', require('midwest-module-membership/passport/router'));

// routes > api > membership
server.use('/api/roles', require('midwest-module-membership/services/roles/router'));
server.use('/api/permissions', require('midwest-module-membership/services/permissions/router'));
server.use('/api/invites', require('midwest-module-membership/services/invites/router'));
server.use('/api/users', require('midwest-module-membership/services/users/router'));

// load all postwares
server.use(...postwares);

// mpromise (built in mongoose promise library) is deprecated,
// tell mongoose to use native Promises instead
mongoose.Promise = Promise;
// connect to mongodb
mongoose.connect(config.mongo.uri, _.omit(config.mongo, 'uri'), (err) => {
  if (err) {
    console.error(err);
    process.exit();
  }

  console.info(`[${chalk.cyan('INIT')}] Mongoose is connected.`);
});

// Only start Express server when it is the main module (ie not required by test)
if (require.main === module) {
  server.http = server.listen(config.port, () => {
    console.info(`[${chalk.cyan('INIT')}] HTTP Server listening on port ${chalk.magenta(config.port)} (${chalk.yellow(ENV)})`);
  });
}

module.exports = server;
