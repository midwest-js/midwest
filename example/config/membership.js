'use strict'

const site = require('./site')

module.exports = {
  invite: {
    from: `${site.title} Robot <${site.emails.robot}>`,
    subject: `You have been invited to ${site.title}`
  },

  timeouts: {
    // 1 day
    changePassword: 24 * 60 * 60 * 1000,
    // verify email
    verifyEmail: 7 * 24 * 60 * 60 * 1000
  },

  paths: {
    register: '/register',
    login: '/login',
    forgotPassword: '/forgot-password',
    updatePassword: '/change-password'
  },

  redirects: {
    login: '/admin',
    logout: '/',
    register: '/admin'
  },

  remember: {
    // if expires is defined, it will be used. otherwise maxage
    expires: new Date('2038-01-19T03:14:07.000Z'),
    // expires: Date.now() - 1,
    maxAge: 30 * 24 * 60 * 60 * 1000
  },

  messages: {
    login: {
      notLocal: 'Account requires external login.',
      wrongPassword: 'Wrong password.',
      noLocalUser: 'No user registered with that email.',
      noExternalUser: 'The account is not connected to this website.',
      externalLoginFailed: 'External login failed.',
      unverified: 'This account has not been verified.',
      banned: 'User is banned.',
      blocked: 'User is blocked due to too many login attempts.'
    },

    register: {
      missingProperties: 'Oh no missing stuff',
      notAuthorized: 'The email is not authorized to create an account.',
      duplicateEmail: 'The email has already been registered.'
    }
  },

  passport: {
    local: {
      usernameField: 'email'
    },

    scope: ['email']

    // providers: {
    //  facebook: {
    //    clientID: 'change-this-fool',
    //    clientSecret: 'change-this-fool',
    //    callbackURL: p.join(config.site.domain, '/auth/facebook/callback'),
    //    passReqToCallback: true
    //  },

  },

  // needs to be even
  tokenLength: 64,
  // needs to be even
  saltLength: 16
}
