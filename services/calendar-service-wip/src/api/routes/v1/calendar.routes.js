const express = require('express')

const controller = require('../../controllers/calendar.controller')
const authenticated = require('../../middlewares/authenticated')

const router = express.Router()

// protected route
router
  .route('/status')
  .get(
    authenticated,
    controller.getStatus
  )

router
  .route('/:calendarId')
  .get(
    authenticated,
    controller.getAllCourse
  )

router
  .route('/:calendarId/week/:nextWeek*?')
  .get(
    authenticated,
    controller.getWeekCourses
  )

router
  .route('/:calendarId/day/:nextDay*?')
  .get(
    authenticated,
    controller.getDayCourses
  )

router
  .route('/:calendarId/:idCours')
  .get(
    authenticated,
    controller.getCoursById
  )

router
  .route('/token')
  .get(
    authenticated
  )

module.exports = router
