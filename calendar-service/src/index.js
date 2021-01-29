'use strict'
const {EventEmitter} = require('events')
const server = require('./server/server')
const repository = require('./repository/repository')
const config = require('./config/')
const mediator = new EventEmitter()

console.log('--- Calendar Service ---')
console.log('Connecting to Calendar repository...')

process.on('uncaughtException', (err) => {
  console.error('Unhandled Exception', err)
})

process.on('uncaughtRejection', (err, promise) => {
  console.error('Unhandled Rejection', err)
})

mediator.on('calendar.ready', (auth) => {
  repository.connect(auth)
    .then(repo => {
      console.log('Connected. Starting Server')
      return server.start({
        port: config.serverSettings.port,
        repo
      })
    })
    .then(app => {
      console.log(`Server started succesfully, running on port: ${config.serverSettings.port}.`)
      app.on('close', () => {
        console.log('Disconnected')
      })
    })
})

config.googleAuth.connect(mediator)

mediator.emit('boot.ready')
