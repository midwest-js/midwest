'use strict';

const defaults = {
  uri: 'mongodb://newseri-supreme:oh-look-it-is-raining-news@mongo.newseri.com/newseri',
};

module.exports = Object.assign(defaults, {
  testing: {
    uri: 'mongodb://localhost/newseri-testing',
  },
  production: {
    uri: 'mongodb://newseri-supreme:oh-look-it-is-raining-news@localhost/newseri',
  },
}[ENV]);
