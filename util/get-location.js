'use strict'

module.exports = (req) => {
  const [ pathname, query ] = req.originalUrl.split('?')
  const host = req.get('host')

  const [ hostname, port = '' ] = host.split(':')
  const protocol = `${req.protocol}:`
  const href = `${protocol}//${host}${req.originalUrl}`

  return {
    host,
    hostname,
    protocol,
    href,
    pathname,
    port,
    url: req.originalUrl,
    search: query ? `?${query}` : ''
  }
}
