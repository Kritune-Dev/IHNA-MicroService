const fs = require('fs')
const googleAuth = require('google-auth-library')
const path = require('path')

exports.connect = (mediator) => {
  mediator.once('boot.ready', () => {
    const googleSecrets = JSON.parse(fs.readFileSync(path.resolve('./src/config/credentials.json'))).installed
    var auth = new googleAuth.OAuth2Client(
      googleSecrets.client_id,
      googleSecrets.client_secret,
      googleSecrets.redirect_uris[0]
    )

    const token = fs.readFileSync(path.resolve('./src/config/token.json'))
    auth.setCredentials(JSON.parse(token))

    console.log('Authentification GoogleAPI done')
    mediator.emit('googleApi.ready', auth)
  })
}
