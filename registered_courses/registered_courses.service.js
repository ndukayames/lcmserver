const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const registered_courses =  require('./registered_courses.model');
const db = require('_helpers/db');
const Student = require('../users/student.model');

module.exports = {
  register_course,
  check_available_course,
  get_registered_course,
  get_hoc_courses,
  remove_course,
  non_dept_registration,
  student_course_reg,
  delete_registered_course,
  get_classmates,
  get_student_ca_scores,
  submit_ca_score
};

async function register_course(newCourseParam) {
  try {
    const newCourse = new registered_courses(newCourseParam)
    await newCourse.save()
    return true;
  } catch (error) {
    throw "error adding course"
  }
}

async function check_available_course(studentParam) {
  const courses = await registered_courses
    .find()
    .populate('hoc', '-password -complete_profile')
    .populate('course_lecturer', '-password -complete_profile')
    .populate('course_student.student_id', '-password')
    const {department, level} = studentParam;
    let available_courses = []
    courses.forEach(course => {
    let myHoc = course.hoc.find(hoc => {
      return hoc.department === department && hoc.level === level
    });
    if(myHoc) {
      available_courses.push(course)
    }

    });
    if(available_courses) {
      return available_courses;
    } else{
      throw "no courses found for this student"
    }
  
}

async function get_registered_course(courseID) {
  const course = registered_courses
  .findById(courseID)
  .populate('hoc', '-password -complete_profile')
  .populate('course_lecturer', '-password -complete_profile');
  return course
}

async function get_hoc_courses(hoc) {
  // get all the courses registered by the hoc

  try {
    const courses = await registered_courses
    .find({hoc})
    .populate('hoc', '-password -complete_profile')
    .populate('course_lecturer', '-password -complete_profile');
    if(!courses || courses.length < 1 ) {
      throw "no registered course"
    } else {
      return courses
    }
  } catch (error) {
    
    throw error
  }
} 

async function remove_course(hoc,{_id}) {
  try {
    let course = await registered_courses
    .findById(_id);
    if( !course || course.length < 1 ) {
      throw "invalid course"
    } else {

      course.hoc.pop(hoc)
      course.save()

      return true
    }
  } catch (error) {

    throw error
  }
}

async function non_dept_registration({hoc,course_code}) {
  try {

    let newCourse = await registered_courses.findOneAndUpdate(
      {course_code},
      {$push : {hoc}},
    { omitUndefined: true, new: true }
    )
    if(!newCourse) {
      throw "course does not exist"
    }

  } catch (error) {

    throw error
  }
}

async function student_course_reg(studentID,{course_code}) {
console.log(studentID,course_code)
  try {
    let registration = await registered_courses.findOne({course_code})
    
    if(registration) {
      let student = await Student.findById(studentID)
      if(student){
        // 
        if(!student.registered_courses.includes(course_code)) {
          student.registered_courses.push(course_code)
          student.save().then(res => {
            console.log('added ' + course_code + ' to students')
          })
        }
        if(!registration.course_student.includes({
          student_id: studentID
        })) {
          registration.course_student.push({
            student_id: studentID
          })
          registration.save().then(res => {
            console.log('added ' + course_code + ' to registration')
          })
        }
      } else {
        throw "invalid student ID"
      }
    } else{
      throw "can\'t find course"
    }
  } catch (error) {
    
    
    throw error
  }
}

async function delete_registered_course(studentID,{course_code}) {

  try {
    let registration = await registered_courses.findOne({course_code})
    if(registration) {
      let student = await Student.findById(studentID)
      if(student){
        // 
        if(student.registered_courses.includes(course_code)) {
          student.registered_courses.pop(course_code)
          student.save().then(res => {
            console.log('removed ' + course_code + ' from students')
          })
        }
        if(registration.course_student.includes({
          student_id: studentID
        })) {
          registration.course_student.student_id.pop({
            student_id: studentID})
          registration.save().then(res => {
            console.log('removed ' + course_code + ' from regration')
          })
        }
      } else {
        throw "invalid student ID"
      }
    } else{
      throw "can\'t find course"
    }
  } catch (error) {
    
    
    throw error
  }
}
async function get_classmates({course_id}) {
  console.log("course id ",course_id)
  try {
    let classmates = await registered_courses.findOne({_id:course_id})
    .populate('course_student.student_id')
    .select('course_student course_code');
    return classmates
  } catch (error) {
    console.log(error)
    throw error
  }
}

async function get_student_ca_scores({student_id,course_id}) {
  try {
    let scores = await registered_courses.find({
      _id: course_id,
      "course_student.student_id": student_id
    })
    .select("course_student")
    let counter = 0
    scores.forEach(res => {
      let ascore = res.course_student.find(res2 => {
        return res2.student_id._id == student_id
      })
      counter++
      if(counter == scores.length) {
        scores = ascore
      }
    })
    console.log(scores)
    return scores
  } catch (error) {
    throw error
  }
}
async function submit_ca_score({course_id,student_id,student_score}) {
  console.log(course_id,student_id,student_score)
  try {
    let opera = await registered_courses.findOne({
      _id:course_id,
      "course_student.student_id" : student_id
    }).then(res => {
      let student = res.course_student.find(reslt => {
        return reslt.student_id == student_id
      })
      student.student_score = student_score
      res.save()
    })
  } catch (error) {
    console.log(error)
    throw error
  }
}