'use strict'
const status = require('http-status')

module.exports = (app, options) => {
  const {repo} = options

  app.get('/calendar/:calendarId', (req, res, next) => {
    repo.getAllCourse(req.params.calendarId).then(courses => {
      res.status(status.OK).json(courses)
    }).catch(next)
  })

  app.get('/calendar/:calendarId/week/:nextWeek*?', (req, res, next) => {
    repo.getWeekCourses(req.params.calendarId, parseInt(req.params.nextWeek)).then(courses => {
      res.status(status.OK).json(courses)
    }).catch(next)
  })

  app.get('/calendar/:calendarId/day/:nextDay*?', (req, res, next) => {
    repo.getDayCourses(req.params.calendarId, parseInt(req.params.nextDay)).then(courses => {
      res.status(status.OK).json(courses)
    }).catch(next)
  })

  app.get('/calendar/:calendarId/:idCours', (req, res, next) => {
    repo.getCoursById(req.params.calendarId, req.params.idCours).then(course => {
      res.status(status.OK).json(course)
    }).catch(next)
  })
}
