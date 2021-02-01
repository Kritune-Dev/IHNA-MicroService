/* eslint-disable array-callback-return */
const googleAuth = require('./googleAuth.service')
const APIError = require('../utils/APIError')
const logger = require('../utils/logger')(__filename)

class CallApiService {
  static notAuthenticated () {
    return { message: 'NOT_AUTHENTICATED' }
  }

  static getAllCourse (calendarId) {
    const calendar = googleAuth.getCalendar()
    const dateMin = startDate()

    return new Promise((resolve, reject) => {
      calendar.events.list({
        calendarId: calendarId,
        timeMin: (dateMin.toISOString()),
        singleEvents: true,
        maxResults: 1000,
        orderBy: 'startTime'
      }, async (err, res) => {
        if (err) {
          reject(new Error('An error occured fetching all course in calendar ' + calendarId + ', err:' + err))
        }
        const events = res.data.items
        const all = new Array(0)
        await events.map(async (event, i) => { all.push(await getEventCourse(event)) })
        resolve({ all })
      })
    })
  }

  static getWeekCourses (calendarId, nextWeek) {
    const calendar = googleAuth.getCalendar()
    const dateMin = startDate()
    const dateMax = startDate()

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
      }, async (err, res) => {
        if (err) {
          reject(new Error('An error occured fetching all course of the week in calendar ' + calendarId + ', err:' + err))
        }
        const events = res.data.items
        if (events.length < 1) {
          const ret = 'No data for ' + dateMin.toISOString() + ' to ' + dateMax.toISOString()
          resolve({ day: ret })
        }

        const week = new Array(0)
        await events.map(async (event, i) => { week.push(await getEventCourse(event)) })
        resolve({ week: week })
      })
    })
  }

  static getDayCourses (calendarId, nextDay) {
    const calendar = googleAuth.getCalendar()
    const dateMin = startDate()
    const dateMax = startDate()

    if (nextDay > 0) {
      const date = dateMin.getDate()
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
      }, async (err, res) => {
        if (err) {
          reject(new Error('An error occured fetching all course of the day in calendar ' + calendarId + ', err:' + err))
        }
        const events = res.data.items
        if (events.length < 1) {
          const ret = 'No data for ' + dateMin.toISOString()
          resolve({ day: ret })
        }
        const day = new Array(0)
        await events.map(async (event, i) => { day.push(await getEventCourse(event)) })
        resolve({ day })
      })
    })
  }

  static getCoursById (calendarId, idCours) {
    const calendar = googleAuth.getCalendar()
    return new Promise((resolve, reject) => {
      calendar.events.get({
        calendarId: calendarId,
        eventId: idCours
      }, async (err, res) => {
        if (err) {
          const message = `An error occured fetching course (${idCours}) in calendar ${calendarId}`
          const error = new APIError(err)
          error.message = message
          error.status = err.code
          reject(error)
        } else {
          resolve(await getEventCourse(res.data))
        }
      })
    })
  }
}

function startDate () {
  const date = new Date()
  date.setHours(1, 0, 0, 0)
  return date
}

function getEventCourse (event) {
  return new Promise((resolve, reject) => {
    try {
      let infoComplementaire
      if (event.summary.includes('CLI')) {
        infoComplementaire = {
          type: 'Clinique'
        }
      } else if (event.summary.includes('CFC')) {
        const desc = event.description.split('\r\n')
        infoComplementaire = {
          type: 'Formation Clinique Pratique',
          prof: desc[2],
          unit: 'CFC'
        }
      } else if (event.summary.includes('Khôlle')) {
        infoComplementaire = {
          type: 'Khôlle',
          prof: 'Tutorat'
        }
      } else {
        const desc = event.description.split('\r\n')
        const properType = desc[5].split(' -')
        const properUnit = desc[3].split(' -')
        infoComplementaire = {
          type: properType[0],
          prof: desc[2],
          unit: properUnit[0]
        }
      }
      const descProper = event.description.split('\r\n').join(' | ')

      const minutesTotal = (new Date(event.end.dateTime) - new Date(event.start.dateTime)) / 1000 / 60
      const minutes = (minutesTotal % 60)
      const hours = (minutesTotal - minutes) / 60
      const duree = `${hours} heures${minutes > 0 ? (minutes < 10 ? ` et 0${minutes} minutes` : ` et ${minutes} minutes`) : ''}`

      const ret = {
        id: event.id,
        title: event.summary,
        type: infoComplementaire.type,
        location: event.location,
        prof: infoComplementaire.prof,
        unit: infoComplementaire.unit,
        description: descProper,
        dateStart: event.start.dateTime,
        dateEnd: event.end.dateTime,
        duree: duree
      }

      resolve(ret)
    } catch (err) {
      const ret = {
        id: event.id,
        title: event.summary,
        location: event.location,
        description: event.description,
        dateStart: event.start.dateTime,
        dateEnd: event.end.dateTime,
        error: 'Failed to parse event'
      }
      logger.error('Failed to parse event : ' + err)
      resolve(ret)
    }
  })
}

module.exports = CallApiService
