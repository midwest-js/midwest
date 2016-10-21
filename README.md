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

## Middleware & Middlware Factories

+ [./doc/middleware.md](Read the documenation about Middleware & Middleware Factories)

## Configuration

Some middleware factories require configuration.

There is a `/sample-config` directory that contains example configuration
files.  These should be copied into your project's `/server/config` directory
and edited to suit your needs.

## Debugging

Midwest Express (and many, many other modules in NPM) uses the excellent
[Debug](https://github.com/visionmedia/debug) plugin.

To debug everything, simply set `DEBUG=midwest` as an environment variable. To
debug specific parts, set (for example) `DEBUG=midwest:responder`. Debuggable
parts are currently:

- midwest:errorhandler
- midwest:responder
