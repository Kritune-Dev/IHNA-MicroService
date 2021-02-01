const googleAuth = require('./googleAuth.service')

class CallApiService {
  static notAuthenticated () {
    return { message: 'NOT_AUTHENTICATED' }
  }

  static greetUser (payload) {
    return { message: 'GREET_USER', user: payload }
  }

  static getAllCourse (calendarId) {
    var calendar = googleAuth.getCalendar()
    var dateMin = startDate()

    return new Promise((resolve, reject) => {
      calendar.events.list({
        calendarId: calendarId,
        timeMin: (dateMin.toISOString()),
        singleEvents: true,
        maxResults: 1000,
        orderBy: 'startTime'
      }, (err, res) => {
        if (err) {
          reject(new Error('An error occured fetching all course in calendar ' + calendarId + ', err:' + err))
        }
        resolve(res.data.items)
      })
    })
  }

  static getWeekCourses (calendarId, nextWeek) {
    var calendar = googleAuth.getCalendar()
    var dateMin = startDate()
    var dateMax = startDate()

    if (nextWeek > 0) {
      dateMin.setDate(dateMin.getDate() + (nextWeek * 7) - dateMax.getDay())
      dateMax.setDate(dateMax.getDate() + (nextWeek * 7) - dateMax.getDay() + 5)
    } else {
      const dayToAdd = 6 - dateMax.getDay()
      dateMax.setDate(dateMax.getDate() + dayToAdd)
    }

    return new Promise((resolve, reject) => {
      calendar.events.list({
        calendarId: calendarId,
        timeMin: (dateMin.toISOString()),
        timeMax: (dateMax.toISOString()),
        singleEvents: true,
        maxResults: 1000,
        orderBy: 'startTime'
      }, (err, res) => {
        if (err) {
          reject(new Error('An error occured fetching all course of the week in calendar ' + calendarId + ', err:' + err))
        }
        const events = res.data.items
        if (events.length < 1) {
          var ret = 'No data for ' + dateMin.toISOString() + ' to ' + dateMax.toISOString()
          resolve({day: ret})
        }
        var week = new Array(0)
        var day = new Array(0)
        var pendingDate

        events.map((event, i) => {
          var date = new Date(event.start.dateTime)
          date.setHours(1, 0, 0, 0)
          var comparePendingDate = new Date(pendingDate)

          if (date - comparePendingDate !== 0) {
            if (day.length > 0) { week.push({day: day}) }
            day = new Array(0)
            pendingDate = date
          }

          day.push(getEventCourse(event))
        })

        week.push({day: day})
        resolve({week: week})
      })
    })
  }

  static getDayCourses (calendarId, nextDay) {
    var calendar = googleAuth.getCalendar()
    var dateMin = startDate()
    var dateMax = startDate()

    if (nextDay > 0) {
      var date = dateMin.getDate()
      dateMin.setDate(date + nextDay)
      dateMax.setDate(date + nextDay + 1)
    } else {
      dateMax.setDate(dateMax.getDate() + 1)
    }

    return new Promise((resolve, reject) => {
      calendar.events.list({
        calendarId: calendarId,
        timeMin: (dateMin.toISOString()),
        timeMax: (dateMax.toISOString()),
        singleEvents: true,
        maxResults: 1000,
        orderBy: 'startTime'
      }, (err, res) => {
        if (err) {
          reject(new Error('An error occured fetching all course of the day in calendar ' + calendarId + ', err:' + err))
        }
        const events = res.data.items
        if (events.length < 1) {
          var ret = 'No data for ' + dateMin.toISOString()
          resolve({day: ret})
        }
        const day = new Array(0)
        events.map((event, i) => { day.push(getEventCourse(event)) })
        resolve({day})
      })
    })
  }

  static getCoursById (calendarId, idCours) {
    var calendar = googleAuth.getCalendar()
    return new Promise((resolve, reject) => {
      calendar.events.get({
        calendarId: calendarId,
        eventId: idCours
      }, (err, res) => {
        if (err) {
          reject(new Error(`An error occured fetching course (${idCours}) in calendar ` + calendarId + ', err:' + err))
        }
        resolve(getEventCourse(res.data))
      })
    })
  }
}

function startDate () {
  var date = new Date()
  date.setHours(1, 0, 0, 0)
  return date
}

function getEventCourse (event) {
  var ret = {
    id: event.id,
    title: event.summary,
    type: 'TO DO - TD ou CM ou Clinique etc...',
    location: event.location,
    prof: 'TO DO - Mr machin...',
    unit: 'TO DO - UE x.x',
    description: event.description,
    dateStart: event.start.dateTim,
    dateEnd: event.end.dateTime,
    duree: 'TO DO - 2 heures'
  }
  return ret
}
module.exports = CallApiService
