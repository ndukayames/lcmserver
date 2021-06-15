const express = require('express');
const router = express.Router();
const classService = require('./classes.service')

router.post('/create-class', create_class);
router.post('/start-class', start_class)
// router.get('/get-class', get_class)
router.post('/end-class', end_class)
router.post('/cancel-class', cancel_class)
router.post('/remove-student', removeStudentFromClass)
router.post('/get-ongoing-classes', getMyOnGoingClasses )
router.post('/mark-attendance', mark_attendance)
router.post('/check', check_if_in_class)
router.post('/get-other-classes', get_other_classes)
router.post('/get-class-history', get_class_history)
router.post('/check-class-attendance', check_course_attendance)
router.post('/get-dept-attendance', get_dept_attendance_log)
router.post('/lecturer-dept-attendance', get_lect_dept_attendance_log)
router.post('/add-class-note', add_class_note)

module.exports = router

async function end_class( req, res) {

  //hoc ends a class
  try {
    const {_id} = req.body
    await classService.end_class(_id)
    res.send({
      success: true,
      msg: 'class ended'
    })
  } catch (error) {
    throw res.status(400).json({
      success: false,
      msg: error
    })
  }
}

async function create_class ( req, res, next ) {
  //hoc creates a class
  try {
    await classService.create_class(req.body)
    res.send({
      success: true,
      msg: 'class created'
    })
  } catch (error) {
    // next(error)
    throw res.status(400).json({
      success: false,
      msg: error
    })
  }
}

async function cancel_class ( req, res) {
  //hoc cancel a class

  const {_id} = req.body
  try {
    await classService.cancel_class(_id)
    res.send({
      success: true,
      msg: 'class canceled'
    })
  } catch (error) {
    throw res.status(400).json({
      success: false,
      msg: error
    })
  }
}

async function start_class( req, res) {
  //hoc starts a class
  const {class_id} = req.body
  try {
    await classService.start_class(req.user.sub, class_id)
    res.send({
      success: true,
      msg: 'class started'
    })
  } catch (error) {
    throw res.status(400).json({
      success: false,
      msg: error
    })
  }
}

async function removeStudentFromClass( req, res ) {
  await classService.removeStudentFromClass(req.body)
  res.json("success")
}

async function getMyOnGoingClasses( req, res ) {
  try {
    let ongoingClasses = await classService.getMyOnGoingClasses(req.body)
    res.json({
      success: true,
      msg: 'classes collected',
      result: ongoingClasses
    })
  } catch (error) {
    
    throw res.status(400).json({
      success: false,
      msg: error
    })
  }
}

async function mark_attendance( req, res ) {
  try {
    await classService.mark_attendance(req.user.sub, req.body)
    res.json({
      success: true,
      msg: 'attendance submitted',
    })
  } catch (error) {
    throw res.status(400).json({
      success: false,
      msg: error
    })
  }
}

async function check_if_in_class( req, res ) {
  try {
    await classService.check_if_in_class(req.user.sub,req.body)
    res.json({
      success: true,
      msg: 'student is in class',
      result: true
    })
  } catch (error) {
    throw res.status(400).json({
      success: false,
      msg: error
    })
  }
}

async function get_other_classes( req, res ) {
  try {
    let otherClasses = await classService.get_other_classes(req.body)
    res.json({
      success: true,
      msg: 'student is in class',
      result: otherClasses
    })
  } catch (error) {
    throw res.status(400).json({
      success: false,
      msg: error
    })
  }
}

async function get_class_history( req, res ) {
  try {
    let theClass = await classService.get_class_history(req.body)
    res.json({
      success: true,
      msg: 'class history collected',
      result: theClass
    })
  } catch (error) {
    throw res.status(400).json({
      success: false,
      msg: error
    })
  }
}

async function check_course_attendance( req, res ) {
  try {
    await classService.check_course_attendance(req.user.sub,req.body)
    res.json({
      success: true,
      msg: 'Student is in class'
    })
  } catch (error) {
    throw res.status(400).json({
      success: false,
      msg: error
    })
  }
}

async function get_dept_attendance_log( req, res ) {

  try {
    let log = await classService.get_dept_attendance_log(req.user.sub,req.body)
    res.json({
      success: true,
      msg: 'Student is in class',
      result: log
    })
  } catch (error) {
    throw res.status(400).json({
      success: false,
      msg: error
    })
  }
}

async function get_lect_dept_attendance_log( req, res ) {
  try {
    let logs = await classService.get_lect_dept_attendance_log(req.body)
    res.json({
      success: true,
      msg: 'Student is in class',
      result: logs
    })
  } catch (error) {
    throw res.status(400).json({
      success: false,
      msg: error
    })
  }
}

async function add_class_note( req, res ) {
  try {
    await classService.add_class_note(req.body)
    res.json({
      success: true,
      msg: 'note added'
    })
  } catch (error) {
    throw res.status(400).json({
      success: false,
      msg: error
    })
  }
}