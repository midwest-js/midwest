# Middleware & Middlware Factories

The `/middleware` directory contains middleware but mostly middleware
factories. Middleware are of course simple functions accepting `req`, `res` and
`next` as arguments. Middleware factories are functions that return middleware
functions.

## Middleware

The simplest of the very few pure middleware functions provided by Midwest Express
is the ensure found middleware. 

```js
const _ = require('lodash');

module.exports = function ensureFound(req, res, next) {
  if (res.template || res.master || !_.isEmpty(res.locals) || res.statusCode === 204) {
    next();
  } else {
    const err = new Error(`Not found: ${req.path}`);
    err.status = 404;

    next(err);
  }
};
```

### List of Middleware Provided

- ensureFound
- responder

## Middleware Factories

Most provided modules are actually factories of middleware, not middleware. The
most simple are definately set-master & set-template. `set-master.js` looks as
follows:

```js
module.exports = (master) => function setMaster(req, res, next) {
  res.master = master;
  next();
};
```

### List of Middleware Factories Provided

- bootstrap
- errorHandler
- formatQuery
- page
- paginate
- parallel
- redirect
- rest
- setLocal
- setMaster
- setTemplate
- shim
