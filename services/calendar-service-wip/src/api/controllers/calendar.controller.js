const httpStatus = require('http-status')
const CallApiService = require('../services/callApi.service')
const InformationService = require('../services/information.service')

exports.me = (req, res, next) => {
  try {
    const { name } = req.query
    const response = CallApiService.greetUser(name)
    res.status(httpStatus.OK).json(response)
  } catch (e) {
    next(e)
  }
}

exports.getStatus = (req, res, next) => {
  try {
    const response = InformationService.packageParseInformation(req)
    res.status(httpStatus.OK).json(response)
  } catch (e) {
    next(e)
  }
}

exports.getAllCourse = async (req, res, next) => {
  try {
    const response = await CallApiService.getAllCourse(req.params.calendarId)
    res.status(httpStatus.OK).json(response)
  } catch (e) {
    next(e)
  }
}

exports.getWeekCourses = async (req, res, next) => {
  try {
    const response = await CallApiService.getWeekCourses(req.params.calendarId, parseInt(req.params.nextWeek))
    res.status(httpStatus.OK).json(response)
  } catch (e) {
    next(e)
  }
}

exports.getDayCourses = async (req, res, next) => {
  try {
    const response = await CallApiService.getDayCourses(req.params.calendarId, parseInt(req.params.nextDay))
    res.status(httpStatus.OK).json(response)
  } catch (e) {
    next(e)
  }
}

exports.getCoursById = async (req, res, next) => {
  try {
    const response = await CallApiService.getCoursById(req.params.calendarId, req.params.idCours)
    res.status(httpStatus.OK).json(response)
  } catch (e) {
    next(e)
  }
}
