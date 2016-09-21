'use strict';

const _ = require('lodash');

const defaults = {
  auth: {
    user: 'SMTP_Injection',
    // dev key
    pass: '2eec390c5b3f5d593c9f152179bf51e90b073784',
  },
  host: 'smtp.sparkpostmail.com',
  port: 587,
};

module.exports = _.merge(defaults, {}[ENV]);
