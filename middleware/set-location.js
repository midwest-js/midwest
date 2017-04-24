'use strict';

module.exports = function setLocation(req, res, next) {
  const protocol = `${req.protocol}:`;
  const [ pathname, query ] = req.originalUrl.split('?');
  const host = req.get('host');
  const [ hostname, port = '' ] = host.split(':');
  const href = `${protocol}//${host}${req.originalUrl}`;

  res.locals.location = Object.assign({
    host,
    hostname,
    protocol,
    href,
    pathname,
    port,
    url: req.originalUrl,
    search: query ? `?${query}` : '',
  });

  next();
};
