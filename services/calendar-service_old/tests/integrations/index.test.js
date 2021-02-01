const supertest = require('supertest')
const server = require('../../src/server/server')
const testCours = require('../../src/mock/cours')
const testWeek = require('../../src/mock/week')

var app

beforeAll(() => {
  return server.start({
    port: 3000,
    repo: testRepo
  }).then(serv => {
    app = serv
  })
})

afterAll(() => {
  app.close()
  app = null
})

let testRepo = {
  getWeekCourses (calendarId, week) {
    return Promise.resolve(testWeek)
  },
  getDayCourses (calendarId, day) {
    return Promise.resolve(testCours)
  },
  getAllCourse (calendarId) {
    return Promise.resolve(testCours)
  },
  getCoursById (calendarId, eventId) {
    return Promise.resolve(testCours[0])
  }
}

var url = '127.0.0.1:3000'

describe('Integration Calendar API', () => {
  describe('Testing all routes', () => {
    it('Should GET /calendar/fooCalendarId return informations all cours on promo', async () => {
      const response = await supertest(url)
        .get('/calendar/fooCalendarId')

      expect(response.statusCode).toBe(200)
      expect(response.body).toStrictEqual(testCours)
    })

    it('Should GET /calendar/fooCalendarId/day return informations all cours on promo for one day', async () => {
      const response = await supertest(url)
        .get('/calendar/fooCalendarId/day')

      expect(response.statusCode).toBe(200)
      expect(response.body).toStrictEqual(testCours)
    })

    it('Should GET /calendar/fooCalendarId/week return informations all cours on promo for the week', async () => {
      const response = await supertest(url)
        .get('/calendar/fooCalendarId/week')

      expect(response.statusCode).toBe(200)
      expect(response.body).toStrictEqual(testWeek)
    })

    it('Should GET /calendar/fooCalendarId/id return informations of the eventId on promo', async () => {
      var id = 'ki4qa8ui6i5vvung3ldkalcmvo'
      const response = await supertest(url)
        .get('/calendar/fooCalendarId/' + id)

      expect(response.statusCode).toBe(200)
      expect(response.body).toStrictEqual(testCours[0])
    })
  })
})

