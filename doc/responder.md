# The Global Responder Middleware

Only the global responder should ever be terminating a request (ie. send a response).

The responder is a very short and simple middleware that decides what to send
back to the client. It is actually easiest to show the code


## Caveats

### Prevent Flattening

If there is only a signle property on the `res.locals` object,
the responder will send that property directly. Ie. if `res.locals = { poopsicle: {...} }`
`{...}` will be send instead of `{ poopsicle: {...} }`.

## Static routes also matching dynamic routes

Since no middleware except the responder should be sending the response,
dynamic routes that match static routes will clash.

Ie. if you have 

```js
module.exports = [
  [ '/api/users/me', mw.getCurrent ],
  [ '/api/users/:id', isAdmin, mw.findById ]
]
```

and make a request to `/api/users/me`, the isAdmin
and `mw.findById` middleware will always be called after `mw.getCurrent`.
If the user is not an admin, all requests to `/api/users/me` will return
the `401` response from `isAdmin` middleware.

To prevent this, create a `Express#param` function like so:

```js
router.param(':id', (req, res, next, id) => {
  if (id === 'me')
    return next('route')

  next()
})
```
