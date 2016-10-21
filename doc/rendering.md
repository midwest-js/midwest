# Rendering HTML

One of the most important parts of using a Midwest Express workflow is to
override the default Express response rendering functionality. Instead of
passing a view/template name as a string to `res.render()` or `app.render()`,
one should pass a render function. The second arguement of this
shall be the response (or any other writeable stream).

A very simple example of this is the following:

```js
const server = express();

server.response.render = function (template) {
  const locals = Object.assign({}, server.locals, this.locals);

  this.send(template.render(locals));
};
```

A template function simply returns a string;

```js
module.exports = (locals) => (
  `<div>${locals.title}</div>`
);
```

### JSX

Using a library like [jsx-node](https://github.com/lohfu/jsx-node) you
can conveniently use JSX in your template functions/modules.

```js
const server = express();

server.response.render = require('./render.jsx');
```

`render.jsx` could look like this:

```js
module.exports = function (Component, Master) {
  const locals = Object.assign({}, this.app.locals, this.locals);

  let preamble;
  let html;

  if (typeof Master === 'function') {
    preamble = '<!doctype html>';

    if (typeof Component === 'function') {
      return this.send(preamble + (
        <Master {...locals}>
          <Component {...locals}/>
        </Master>
      ));
    }

    Component = Master;
  }
  
  if (typeof Component !== 'function') {
    throw new Error('Not a Component');
  } else if (Component.prototype && Component.prototype.render) {
    const instance = new Component(locals);
    html = instance.render(instance.props, instance.state);
  } else {
    html = Component(locals);
  }

  this.send(preamble ? preamble + html : html);
};
```
