const express = require('express');
const router = express.Router();
const studentService = require('./student.service');

// routes
router.post( '/authenticate', authenticate );
router.post( '/register', register);
router.get( '/getStudentData', getStudentData );
router.post( '/get-registered-courses', get_registered_courses );
router.post( '/check-complete-profile', check_complete_profile );
router.post('/update-profile', update_profile)

module.exports = router;

async function authenticate( req, res, next ) {
  try {
    let user = await studentService.authenticate(req.body)
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

async function register( req, res, next ) {

  try {
    await studentService.create(req.body)
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

async function getStudentData( req, res, next ) {
  console.log(req.user.sub)
  try {
    let student = await studentService.getStudentById(req.user.sub)

    res.json({
      success: true,
      msg: 'student data collected',
      result: student
    })
  } catch (error) {
    throw res.status(400).json({
      success: false,
      msg: error
    })
  }
}

async function get_registered_courses( req, res ) {
  //fetches student's registered courses
  try {
    let registered_courses = await studentService.get_registered_courses(req.body)
    res.json({
      success : true,
      msg: 'success',
      result: registered_courses
    })
  } catch (error) {
    throw res.status(400).json({
      success: false,
      msg: error
    })
  }
}

async function check_complete_profile( req, res ) {
  try {
    let status = await studentService.check_complete_profile(req.body)
    res.json({
      success : true,
      msg: 'success',
      result: status
    })
  } catch (error) {
    throw res.status(400).json({
      success: false,
      msg: error
    })
  }
}

async function update_profile( req, res ) {
  try {
    let status = await studentService.update_profile(req.user.sub,req.body)
    res.json({
      success : true,
      msg: 'success',
      result: status
    })
  } catch (error) {
    throw res.status(400).json({
      success: false,
      msg: error
    })
  }
}
