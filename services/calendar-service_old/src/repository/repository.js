// repository.js
'use strict'
const { google } = require('googleapis')

// factory function, that holds an open connection to the db,
// and exposes some functions for accessing the data.
const repository = (calendar) => {
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

  const getWeekCourses = (calendarId, weekToAdd) => {
    var dateMin = startDate()
    var dateMax = startDate()

    if (weekToAdd > 0) {
      dateMin.setDate(dateMin.getDate() + (weekToAdd * 7) - dateMax.getDay())
      dateMax.setDate(dateMax.getDate() + (weekToAdd * 7) - dateMax.getDay() + 5)
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

  const getDayCourses = (calendarId, dayToAdd) => {
    var dateMin = startDate()
    var dateMax = startDate()

    if (dayToAdd > 0) {
      var date = dateMin.getDate()
      dateMin.setDate(date + dayToAdd)
      dateMax.setDate(date + dayToAdd + 1)
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

  const getAllCourse = (calendarId) => {
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
        console.log(res.data.items)
      })
    })
  }

  // TODO : Get the correct fonction
  const getCoursById = (calendarId, coursId) => {
    return new Promise((resolve, reject) => {
      calendar.events.get({
        calendarId: calendarId,
        eventId: coursId
      }, (err, res) => {
        if (err) {
          reject(new Error(`An error occured fetching course (${coursId}) in calendar ` + calendarId + ', err:' + err))
        }
        resolve(getEventCourse(res.data))
      })
    })
  }

  return Object.create({
    getWeekCourses,
    getDayCourses,
    getAllCourse,
    getCoursById
  })
}

const connect = (auth) => {
  return new Promise((resolve, reject) => {
    const calendar = google.calendar({version: 'v3', auth})

    calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime'
    }, (err, res) => {
      if (err) reject(new Error('Connection googleApi not supplied'))
      resolve(repository(calendar))
    })
  })
}
// this only exports a connected repo
module.exports = Object.assign({}, {connect})
