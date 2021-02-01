const express = require('express')

const controller = require('../../controllers/calendar.controller')

const router = express.Router()

// protected route
router
  .route('/status')
  .get(
    controller.getStatus
  )

router
  .route('/:calendarId')
  .get(
    controller.getAllCourse
  )

router
  .route('/:calendarId/week/:nextWeek*?')
  .get(
    controller.getWeekCourses
  )

router
  .route('/:calendarId/day/:nextDay*?')
  .get(
    controller.getDayCourses
  )

router
  .route('/:calendarId/:idCours')
  .get(
    controller.getCoursById
  )

module.exports = router
