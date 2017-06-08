# Midwest Express

Midwest Express is a collection of middleware & utilities for creating webapps
using Express. Midwest could be seen as a modular, opt-in CMS using a KISS
(Keep It Simple Stupid) philosophy.

1. Global responder middleware
2. No views, use functions that return HTML string instead
3. All data sent to client or used in rendering contexts should be set on
   `res.locals`

There is no installer or similar abstraction layer. Using Midwest Express is
currently simply following a recommended way to structure an Express app
bundled with some useful middleware and middleware factories. The app is built
manually and you use the tools and middleware you find suitable for your
project.

## Global Responder Middleware

The main concept behind Midwest is the concept of the responder middleware.
Basically no other middleware should be sending the response, they should simply
call `next()` until the responder is reached. The responder then either
send the contents of `res.locals` as JSON, or renders a template.

[./doc/responder.md](Read the documenation about GRM)

## Rendering HTML

+ [./doc/rendering.md](Read the documenation about Rendering HTML)

## Middleware & Middleware Factories

+ [./doc/middleware.md](Read the documenation about Middleware & Middleware Factories)

## Services

Midwest provides numerous services. A service is simply a module that exposes
handlers, middleware and a router. __Handlers__ are functions that interact with
the database, and should return promises. A service middleware is simply a wrap around
a handler. Midwest middlewares should NOT send a response, rather populate
the response (usually the `res.locals` object) and let the global responder handle
sending the response.

## Configuration

Some middleware factories require configuration.

There is a `/sample-config` directory that contains example configuration
files.  These should be copied into your project's `/server/config` directory
and edited to suit your needs.

## Parametric Modules

Midwest greatly promotes using parametric modules to pass application state
and configuration through to sub modules. Most Midwest services currently
utilize memoized parametric modules, ie they export something like:

```js
module.exports = _.memoize((state) => {
  return {
    ...
  }
})
```

## Debugging

Midwest Express (and many, many other modules in NPM) uses the excellent
[Debug](https://github.com/visionmedia/debug) plugin.

To debug everything, simply set `DEBUG=midwest` as an environment variable. To
debug specific parts, set (for example) `DEBUG=midwest:responder`. Debuggable
parts are currently:

- midwest:errorhandler
- midwest:responder
