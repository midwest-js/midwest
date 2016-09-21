'use strict';

const _ = require('lodash');

const domain = 'bitmill.co';

const defaults = {
  domain,
  title: 'Bitmill',
  name: 'bitmill',
  protocol: 'http',
  get host() {
    return this.port ? `${this.hostname}:${this.port}` : this.hostname;
  },
  get url() {
    return `${this.protocol}://${this.host}/`;
  },
  emails: {
    robot: 'no-reply@thecodebureau.com',
    info: 'info@thecodebureau.com',
    webmaster: 'webmaster@thecodebureau.com',
    order: 'info@thecodebureau.com',
  },
};

module.exports = _.merge(defaults, {
  development: {
    hostname: 'localhost',
    port: process.env.EXTERNAL_PORT || process.env.PORT || require('./port'),
  },

  testing: {
    hostname: 'localhost',
    port: process.env.PORT || require('./port'),
  },

  staging: {
    hostname: `staging.${domain}`,
  },

  production: {
    hostname: domain,
    protocol: 'https',
    emails: {
      robot: `no-reply@${domain}`,
      info: `info@${domain}`,
      webmaster: `webmaster@${domain}`,
      order: `order@${domain}`,
    },
  },
}[ENV]);
