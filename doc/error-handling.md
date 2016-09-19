# Error Handling

## Colorize the Stack

Midwest proves a `colorizeStack` utility that highlights
all files in the stack that are not in the projects `node_modules`.

This greatly simplifies finding what code in your project is actually
causing the error.

It is highly recommended to override the default `uncaughtException`
to utilize this.

```js
const colorizeStack = require('midwest/util/colorize-stack')

// make error output stack pretty
process.on('uncaughtException', (err) => {
  console.error(chalk.red('UNCAUGHT EXCEPTION'))
  if (err.stack) {
    console.error(colorizeStack(err.stack))
  } else {
    console.error(err)
  }
  process.exit(1)
})
```
