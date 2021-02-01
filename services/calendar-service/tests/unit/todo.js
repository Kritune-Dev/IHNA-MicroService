const request = require('supertest')
const app = require('../../src/config/express.config')

describe('Integration Calendar API', () => {
  describe('Testing all routes', () => {
    it('Should GET /calendar/fooCalendarId return informations all cours on promo', async () => {
      const response = await request(app)
        .get('/calendar/fooCalendarId')

      expect(response.statusCode).toBe(200)
    })

    it('Should GET /calendar/fooCalendarId/day return informations all cours on promo for one day', async () => {
      const response = await request(app)
        .get('/calendar/fooCalendarId/day')

      expect(response.statusCode).toBe(200)
    })

    it('Should GET /calendar/fooCalendarId/week return informations all cours on promo for the week', async () => {
      const response = await request(app)
        .get('/calendar/fooCalendarId/week')

      expect(response.statusCode).toBe(200)
    })

    it('Should GET /calendar/fooCalendarId/id return informations of the eventId on promo', async () => {
      const id = 'ki4qa8ui6i5vvung3ldkalcmvo'
      const response = await request(app)
        .get('/calendar/fooCalendarId/' + id)

      expect(response.statusCode).toBe(200)
    })
  })
})
