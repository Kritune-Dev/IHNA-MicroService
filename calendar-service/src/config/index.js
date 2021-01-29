const {serverSettings} = require('./config')
const googleAuth = require('./google_calendar')

module.exports = Object.assign({}, {serverSettings, googleAuth})
