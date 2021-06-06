const express = require('express');
const router = express.Router();
const lecturerService = require('./lecturer.service')

router.post('/create', register)
router.post('/authenticate', authenticate)
router.get('/get-lecturer-details', getLecturerData)
router.get('/get-academic-data', getLecturerAcademicData)
router.post('/complete-profile', complete_lecturer_signup)
router.post('/get-hoc-lecturer', get_hoc_lecturer)
router.get('/get-lecturer-courses', get_lecturer_courses)
router.get('/get-lecturer-ongoing-classes', get_lecturer_ongoing_classes)

module.exports = router

async function register( req, res, next) {
  try {
    await lecturerService.create(req.body)
    res.json({
      success: true,
      msg: "registration successful"
    })
  } catch (error) {

    throw res.status(400).json({
      success: false,
      msg: error
    })
  }
}

async function authenticate( req, res, next ) {
  
  try {
    let user = await lecturerService.authenticate(req.body)
    res.json({
      success: true,
      msg: 'login successful',
      result: user
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      msg: error
    })
  }
}

async function getLecturerData( req, res, next ) {

  try {

    let lecturer = await lecturerService.getLecturerById(req.user.sub)
    res.json({
      success: true,
      msg: 'lecturer data collected',
      result: lecturer
    })
  } catch (error) {
    throw res.status(400).json({
      success: false,
      msg: error
    })
  }
}

async function getLecturerAcademicData( req, res, next ) {
  try {
    let academicData = await lecturerService.getLecturerAcademicData(req.user.sub)
    res.json({
      success: true,
      msg: 'lecturer data collected',
      result: academicData
    })
  } catch (error) {
    throw res.status(400).json({
      success: false,
      msg: error
    })
  }
}

async function complete_lecturer_signup( req, res, next ) {
  try {
    let completeProfileStatus = await lecturerService.complete_lecturer_signup(req.user.sub, req.body)
    res.json({
      success: true,
      msg: 'lecturer profile completed',
      result: completeProfileStatus
    })
  } catch (error) {
    throw res.status(400).json({
      success: false,
      msg: error
    })
  }
}

async function get_hoc_lecturer( req, res, next ) {


  try {
    let lecturers = await lecturerService.get_hoc_lecturer(req.body)
    res.json({
      success: true,
      msg: 'lecturer collected',
      result: lecturers
    })
  } catch (error) {
    throw res.status(400).json({
      success: false,
      msg: error
    })
  }
}

async function get_lecturer_courses( req, res ) {
  try {
    const lecturerClasses = await lecturerService.get_lecturer_courses(req.user.sub)
    res.json({
      success: true,
      msg: 'registered courses collected for lecturer',
      result: lecturerClasses
    })
  } catch (error) {
    throw res.status(400).json({
      success: false,
      msg: error
    })
  }
}

async function get_lecturer_ongoing_classes( req, res ) {
  try {
    const ongoingClasses = await lecturerService.get_lecturer_ongoing_classes(req.user.sub)
    res.json({
      success: true,
      msg: 'ongoing classes collected for lecturer',
      result: ongoingClasses
    })
  } catch (error) {
    throw res.status(400).json({
      success: false,
      msg: error
    })
  }
}