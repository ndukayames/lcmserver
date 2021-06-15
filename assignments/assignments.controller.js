const express = require('express');
const router = express.Router();
const assignmentService = require('./assignments.service')
const multer = require('multer');
var fileExtension = require('file-extension')

router.post('/get-recents', get_recent_assignments)
router.post('/get-due', get_due_assignments)
router.post('/cancel', cancel_assignment)
router.post('/end', end_assignment)
router.post('/get-course-assignments', get_course_assignments)
router.get('/get-all',get_assignments)
router.post('/score-student',score_student)

  var storage1 = multer.diskStorage({

  // Setting directory on disk to save uploaded files
    destination: function (req, file, cb) {
        cb(null, 'submissions-uploads')
    },

    // Setting name of file saved
    filename: function (req, file, cb) {
        cb(null, req.body.assignment_id + '-' + req.body.student_id + '.' + fileExtension(file.originalname))
    }
  })
  var storage2 = multer.diskStorage({
    // Setting directory on disk to save uploaded files
      destination: function (req, file, cb) {
          cb(null, 'new-assignment')
      },
      // Setting name of file saved
      filename: function (req, file, cb) {
          cb(null, file.originalname)
      }
  })
  var upload1 = multer({
    storage: storage1
  })
  var upload2 = multer({
    storage: storage2
  })

router.post('/submit-assignment', upload1.single('lcmassignment'),submit_assignment)

router.post('/create', upload2.single('assignmentimage'), create_assignment);
router.post('/create-no-image', upload2.single('assignmentimage'), create_assignment_no_image);
router.post('/edit-image',upload2.single('assignmentimage'),edit_assignment_image)
router.post('/edit-no-image',edit_assignment_no_image)

 
module.exports = router

async function create_assignment(req, res) {

  try {
    await assignmentService.create_assignment(req.body,req.file)
    res.send({
      success: true,
      msg: 'assignment created',
    })
  } catch (error) {
    throw res.status(400).json({
      success: false,
      msg: error
    })
  }
}
async function create_assignment_no_image(req,res) {
  try {
    await assignmentService.create_assignment_no_image(req.body)
    res.send({
      success: true,
      msg: 'assignment created',
    })
  } catch (error) {
    throw res.status(400).json({
      success: false,
      msg: error
    })
  }
}
async function get_recent_assignments( req, res ) {
  try {
    let recents = await assignmentService.get_recent_assignments(req.body)

    res.send({
      success: true,
      msg: 'recents collected',
      result: recents
    })
  } catch (error) {
    throw res.status(400).json({
      success: false,
      msg: error
    })
  }
} 
async function get_due_assignments( req, res ) {
  try {
    let due = await assignmentService.get_due_assignments(req.body)
    res.send({
      success: true,
      msg: 'due collected',
      result: due
    })
  } catch (error) {
    throw res.status(400).json({
      success: false,
      msg: error
    })
  }
} 

async function edit_assignment_image( req, res ) {
  try {
    await assignmentService.edit_assignment_image(req.body,req.file)
    res.send({
      success: true,
      msg: 'assignment updated',
    })
  } catch (error) {
    throw res.status(400).json({
      success: false,
      msg: error
    })
  }
}

async function edit_assignment_no_image( req, res ) {
  try {
    await assignmentService.edit_assignment_no_image(req.body)
    res.send({
      success: true,
      msg: 'assignment updated',
    })
  } catch (error) {
    throw res.status(400).json({
      success: false,
      msg: error
    })
  }
}

async function cancel_assignment( req, res ) {

  try {
    await assignmentService.cancel_assignment(req.body)
    res.send({
      success: true,
      msg: 'assignment canceled',
    })
  } catch (error) {
    throw res.status(400).json({
      success: false,
      msg: error
    })
  }
}

async function end_assignment( req, res ) {
  try {
    await assignmentService.end_assignment(req.body)
    res.send({
      success: true,
      msg: 'assignment submission ended',
    })
  } catch (error) {
    throw res.status(400).json({
      success: false,
      msg: error
    })
  }
}

async function get_course_assignments( req, res ) {
  try {
    let course_assignment = await assignmentService.get_course_assignments(req.body)
    res.send({
      success: true,
      msg: 'course assignment collected successfully',
      result: course_assignment
    })
  } catch (error) {
    throw res.status(400).json({
      success: false,
      msg: error
    })
  }
}

async function get_assignments(req, res) {
  let assignments = await assignmentService.get_assignments()
  res.send({
    success: true,
    msg: 'course assignment collected successfully',
    result: assignments
  })
}

async function submit_assignment(req,res) {
  
  try {
    const file = req.file
    if (!file) {
        throw 'Please upload a file'
    } else{
    await assignmentService.submit_assignment(req.body,req.file)
      res.send({
        success: true,
        msg: 'assignment submitted successfully',
      })
    }
  } catch (error) {

    throw res.status(400).json({
      success: false,
      msg: error
    })
  }
  
}

async function score_student(req,res) {
  try {
    let student = await assignmentService.score_student(req.body)
    res.send({
      success: true,
      msg: 'student scored successfully',
      result: student
    })
  } catch (error) {
    throw res.status(400).json({
      success: false,
      msg: error
    })
  }
}