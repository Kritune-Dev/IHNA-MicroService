const fs = require('fs')
const path = require('path')
require('dotenv').config()

exports.serverSettings = {
  portHttp: process.env.PORT_HTTP_CALENDAR_SERVICE || 3000,
  portHttps: process.env.PORT_HTTPS_CALENDAR_SERVICE || 3001
}

exports.keySsl = fs.readFileSync(path.resolve(process.env.PATH_KEY_SSL))
exports.certSsl = fs.readFileSync(path.resolve(process.env.PATH_CERT_SSL))
