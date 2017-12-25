'use strict'

module.exports = ({ h, render, Provider, createStore, store }) => {
  return function (Master, ...Components) {
    // warning: without a full merge the following will allow master or
    // components to mutate the locals. but that shoulds really matter.
    const locals = Object.assign({}, this.app.locals, this.locals)

    let html

    if (this.cache) {
      html = this.cache.html
    }

    if (!html && Components.length) {
      let dom = Components.reverse().reduce((result, Component) => {
        if (Array.isArray(Component)) {
          return Component.map((Component) => h(Component, locals, result))
        }

        return h(Component, locals, result)
      }, null)

      if (Provider && (store || createStore)) {
        dom = h(Provider, Object.assign({
          store: store || createStore(locals),
        }), dom)
      }

      if (render) {
        html = render(dom)
      } else {
        html = dom
      }

      if (this.cache) this.cache.html = html
    }

    // even if same master is past ovr n ovr we duz not cash it cuz stufs like
    // skripts mite change becuz of stufs like user agent string n uddr stuf
    if (typeof Master === 'function') {
      html = Master(Object.assign({ html }, locals))
    }

    this.send(html)
  }
}
