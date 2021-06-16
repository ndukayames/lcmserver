const express = require('express');
const router = express.Router();
const rcService = require('./registered_courses.service')

router.post('/register', courseReg);
router.post('/checkavailablecourses', check_available_course)
router.get('/getcourse', get_registered_course)
router.post('/get-hoc-courses', get_hoc_courses)
router.post('/remove-course', remove_course)
router.post('/non-dept-register', non_dept_registration)
router.post('/student-course-reg', student_course_reg)
router.post('/student-course-reg-delete', delete_registered_course)
router.post('/get-class-mates',get_classmates)
router.post('/get-student-ca-scores',get_student_ca_scores)
router.post('/submit-ca-score',submit_ca_score)

module.exports = router

async function courseReg( req, res, next ) {
  try {
    let request = await rcService.register_course(req.body)
    if(request) {
      res.json({
        success: true,
        msg: 'course registered successfully',
        result: request
      })
    } 
  } catch (error) {
    throw res.status(400).json({
      success: false,
      msg: error,
    })
  }
}

async function check_available_course( req, res, next ) {
  //checks courses available to student
  try {
    let request = await rcService.check_available_course(req.body)
    if(request) {
      res.json({
        success: true,
        msg: 'course collected successfully',
        result: request
      })
    }
  } catch (error) {
    console.log(error)
    throw res.status(400).json({
      success: true,
      msg: error,
    })
  }
}

async function get_registered_course( req, res, next) {
  try {
    let request = await rcService.get_registered_course(req.user.sub)
    if(request) {
      res.json({
        success: true,
        msg: 'course collected successfully',
        result: request
      })
    }
  } catch (error) {
    throw res.status(400).json({
      success: true,
      msg: 'error encountered',
    })
  }
}

async function get_hoc_courses( req, res, next) {
  try {
    let request = await rcService.get_hoc_courses(req.user.sub)
    if(request) {
      res.json({
        success: true,
        msg: 'courses collected successfully',
        result: request
      })
    }
  } catch (error) {
    throw res.status(400).json({
      success: false,
      msg: 'no registered course',
    })
  }
}

async function remove_course( req, res, next ) {
 try {
   let request = await rcService.remove_course(req.user.sub,req.body)
   if(request) {
    res.json({
      success: true,
      msg: 'courses removed successfully',
      result: request
    })
  }
 } catch (error) {
  res.status(500).send({
    success: false,
    msg: error
  })
 }
}

async function non_dept_registration( req, res, next ) {
  try {
    await rcService.non_dept_registration(req.body)
    res.json({
      success: true,
      msg: 'courses added successfully',
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      msg: error
    })
  }
}

async function student_course_reg( req, res, next ) {
  try {
    await rcService.student_course_reg(req.user.sub,req.body)
    res.json({
      success: true,
      msg: 'courses added successfully',
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      msg: error
    })
  }
}

async function delete_registered_course(req, res, next) {
  
  try {
    await rcService.delete_registered_course(req.user.sub,req.body)
    res.json({
      success: true,
      msg: 'courses removed successfully',
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      msg: error
    })
  }
}
async function get_classmates(req, res, next) {
  
  try {
    let classmates = await rcService.get_classmates(req.body)
    res.json({
      success: true,
      msg: 'classmates collected successfully',
      result: classmates
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      msg: error
    })
  }
}

async function get_student_ca_scores(req,res) {
  try {
    let score = await  rcService.get_student_ca_scores(req.body)
    res.send({
      success: true,
      msg: 'student ca scores collected successfully',
      result: score
    })
  } catch (error) {
    throw res.status(400).json({
      success: false,
      msg: error
    })
  }
}

async function submit_ca_score( req, res ) {
  try {
    let score = await  rcService.submit_ca_score(req.body)
    res.send({
      success: true,
      msg: 'student ca scores submitted successfully',
      result: score
    })
  } catch (error) {
    throw res.status(400).json({
      success: false,
      msg: error
    })
  }
}