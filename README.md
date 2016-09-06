# Midwest Express

Midwest Express is a collection of middleware & utilities for Express.  Midwest
could be seen as a moduler, opt-in CMS using Express and a KISS (Keep It Simple
Stupid) philosophy.

1. Global responder middleware
2. No views, use renderable objects instead
3. All data to be sent should be set on `res.locals`

There is no installer or abstraction layer. Using Midwest Express is simply
following a recommended way to structure an Express app. The app is built manually
and you use the tools and middleware you find suitable for your project.

## Global Responder Middleware

The main concept behind Midwest is the concept of the responder middleware.
Basically no other middleware should be sending the response, they should simply
call `next()` until the responder is reached. The responder then either
send the contents of `res.locals` as JSON, or renders a template.

[./doc/responder.md](Read more)

## Rendering

One of the most important parts of using a Midwest Express workflow is to
override the default Express response rendering functionality. Instead of
passing a view/template name as a string to `res.render()` or `app.render()`,
one must pass an object with a render method. The second arguement of this
shall be the response (or any other writeable stream).

The default and recommended way of doing this is:

```js
server.response.render = function (template) {
  const locals = Object.assign({}, server.locals, this.locals)

  template.render(locals, this)
}
```

## Configuration

The error handler needs some configuration.

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
