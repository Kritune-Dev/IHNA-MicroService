const {EventEmitter} = require('events')
const mediator = new EventEmitter()
const app = require('./server/server')
const http = require('http')
const https = require('https')
const {serverSettings, keySsl, certSsl} = require('./config/index')
const config = require('./config/index')
require('dotenv').config()

console.log('--- Calendar Service ---')
console.log('Connecting to Google Api...')

process.on('uncaughtException', (err) => {
  console.error('Unhandled Exception', err)
})

process.on('uncaughtRejection', (err, promise) => {
  console.error('Unhandled Rejection', err)
})

mediator.on('googleApi.ready', () => {
  if (process.env.NODE_ENV === 'production') {
    console.log('Application lancée dans le mode production --> Ouverture en https')
    https
      .createServer({ key: keySsl, cert: certSsl }, app)
      .listen(serverSettings.portHttps, () => {
        console.log('Https ouvert sur le port ' + serverSettings.portHttps)
      })
  } else {
    http.createServer(app)
      .listen(serverSettings.portHttp, () => {
        console.log('Serveur https ouvert sur le port ' + serverSettings.portHttps)
      })
  }
})

config.googleAuth.connect(mediator)

mediator.emit('boot.ready')
