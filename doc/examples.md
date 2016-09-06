# Examples

## server.js

A simple example `server/server.js`:

```js
'use strict'

const bodyParser = require('body-parser')
const express = require('express')
const initRoutes = require('midwest/util/init-routes')

const server = express()

server.set('port', 1337)

const prewares = [
  bodyParser.json(),
]

const postwares = [
  require('midwest/middleware/ensure-found'),
  // transform and log error
  require('midwest/middleware/error-handler'),
  // respond
  require('midwest/middleware/responder'),
  // handle error in responder
  require('midwest/middleware/responder-error'),
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

