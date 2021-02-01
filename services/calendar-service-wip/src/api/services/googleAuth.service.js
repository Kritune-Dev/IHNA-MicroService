const fs = require('fs')
const googleAuth = require('google-auth-library')
const path = require('path')
const { google } = require('googleapis')

var auth

exports.connect = () => {
  const googleSecrets = JSON.parse(fs.readFileSync(path.resolve('./src/config/credentials.json'))).installed
  auth = new googleAuth.OAuth2Client(
    googleSecrets.client_id,
    googleSecrets.client_secret,
    googleSecrets.redirect_uris[0]
  )

  const token = fs.readFileSync(path.resolve('./src/config/token.json'))
  auth.setCredentials(JSON.parse(token))

  return 'Authentification GoogleAPI done'
}

exports.getCalendar = () => {
  return google.calendar({version: 'v3', auth})
}
