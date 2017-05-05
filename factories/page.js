'use strict';

module.exports = ({ props, locals }) => (req, res, next) => {
  res.preventFlatten = true;

  if (locals) {
    Object.assign(res.locals, locals);
  }

  if (props) {
    Object.assign(res, props);
  }

  next();
};
