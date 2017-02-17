'use strict';

const timer = require('../factories/timer');

const Layer = require('express/lib/router/layer');

module.exports = (ignore = ['query', 'expressInit', 'logger', 'serveStatic', 'router', 'bound dispatch']) => {
  Layer.prototype._handle_request = Layer.prototype.handle_request;

  Layer.prototype.handle_request = function handle(...args) {
    if (this.handle.length < 4 && !this._handle && !ignore.includes(this.name)) {
      this._handle = this.handle;

      this.handle = timer(this.handle);
    }

    return this._handle_request(...args);
  };
};

