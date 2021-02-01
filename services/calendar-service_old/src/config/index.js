const {serverSettings, keySsl, certSsl} = require('./config')
const googleAuth = require('./google_calendar')

module.exports = Object.assign({}, {serverSettings, keySsl, certSsl, googleAuth})
