const express = require('express')

// import all the routes here
const calendarRoutes = require('./calendar.routes')

const router = express.Router()

router.use('/', calendarRoutes)

module.exports = router
