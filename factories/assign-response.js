'use strict'

module.exports = ({ props, locals }) => (req, res, next) => {
  if (locals) {
    Object.assign(res.locals, locals)
  }

  if (props) {
    Object.assign(res, props)
  }

  next()
}
