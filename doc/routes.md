# Routes

Essentially an Express app is only a collection of route definitions.
Quite quickly the amount of routes become to many to have in your
initial `app.js/server.js` file. Soon they are too numerous to contain
in a single `routes.js` file.


There are two recommended ways of doing/organizing routes in Midwest Express.

## Routers

Express supplies a very powerful router object. Example router file:

```js
'use strict'

const router = new (require('express')).Router()

const mw = require('./middleware')

const { isAdmin } = require('midwest-module-membership/passport/authorization-middleware')

router.route('/')
  .get(mw.formatQuery, mw.paginate, mw.query)
  .post(isAdmin, mw.create)

router.route(':id')
  .get(isAdmin, mw.findById)
  .patch(isAdmin, mw.update)
  .put(isAdmin, mw.replace)
  .delete(isAdmin, mw.remove)

module.exports = router
```

This is then used

```js
const server = require('express')()
const router = require('./routers/poopsicles')

server.use('/api/poopsicles', router)
```

Router files should be organized in a hierarchy that is identical
with the mount path of the router. IE, a router mounted at `/api/poopsicle`
should be named `poopsicle.js` and placed in the `/api` directory.

## Route Arrays

Through the `initRoutes` utility Midwest also enables structuring routes very
differently from standard Express.

This way of doing things was a result of not understanding the native Router
in Express deeply enough. It really isn't needed, but many people find
this way of defining routes more explicit and readable.

To facilitate this approach, there is a route initialization helper which
is available at `midwest/util/init-routes`. This route takes two arguments,
a router or express instance, and the array of routes.

Essentially a route array contains arrays of `[ path, method, ...middleware ]`.
If the array only consists of functions (middleware), then `express.use` will
be used instead of `express[method]`.

An example route file could look like so:

```js
'use strict'

const mw = require('./middleware')

module.exports = [
  [ '/api/articles', 'get', mw.getAll ],
  [ '/api/articles', 'post', mw.create ],
  [ '/api/articles/:id', 'get', mw.findOne ],
  [ '/api/articles/:id', 'put', mw.replace ],
  [ '/api/articles/:id', 'patch', mw.update ],
  [ '/api/articles/:id', 'delete', mw.remove ]
]
```

This can then be used

```js
const server = require('express')()
const initRoutes = require('midwest/util/init-routes')
const routes = require('./routes/poopsicle')

initRoutes(server, routes)
```
