# Warepot

## Configuration

The logger and error handler needs some configuration.

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
