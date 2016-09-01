# Warepot

## Usage

Warepot kind of rapes Express. It does especially routes
in a very non-standard ways.

The main concept behind warepot is the concept of the responder middleware.
Basically no other middleware should be sending the response, they should simply
call `next()` until the responder is reached. The responder then either
send the contents of `res.locals` as JSON, or renders a template.

Essentially routes should just be arrays of `[ path, method, ...middleware ]`.
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

A simple example `server/server.js`:

```js
'use strict'

const bodyParser = require('body-parser')
const express = require('express')
const initRoutes = require('warepot/util/init-routes')

const server = express()

server.set('port', 1337)

const prewares = [
  bodyParser.json(),
]

const postwares = [
  require('warepot/ensure-found'),
  // transform and log error
  require('warepot/error-handler'),
  // respond
  require('warepot/responder'),
  // handle error in responder
  require('warepot/responder-error'),
]

const routes = [
  ...prewares,
  ...require('./routes/index')
  ...postwares
]

initRoutes(server, routes)

// Start Express server.
server.listen(server.get('port'), () => {
  console.info('[' + chalk.cyan('INIT') + '] HTTP server listening on port %d in %s mode', server.get('port'), server.get('env'))
})

module.exports = server
```

## Configuration

The error handler needs some configuration.

There is a `/sample-config` directory that contains example configuration
files.  These should be copied into your project's `/server/config` directory
and edited to suit your needs.

## Debugging

Warepot (and most other server-side modules from TCB) uses the excellent
[Debug](https://github.com/visionmedia/debug) plugin.

To debug everything, simply set `DEBUG=warepot` as an environment variable. To
debug specific parts, set (for example) `DEBUG=warepot:responder`. Debuggable
parts are currently:

- warepot:errorhandler
- warepot:responder

## Caveats

### Static routes also matching dynamic routes

If you have 

```js
module.exports = [
  [ '/api/users/me', mw.getCurrent ],
  [ '/api/users/:id', isAdmin, mw.findById ]
]
```

and make a request to `/api/users/me`, the isAdmin
and `mw.findById` middleware will always be called after `mw.getCurrent`.
If the user is not an admin, all requests to `/api/users/me` will return
the `401` response from `isAdmin` middleware.
