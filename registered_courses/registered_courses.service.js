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
  get_classmates
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
        if(!registration.course_student.student_id.includes(studentID)) {
          registration.course_student.student_id.push(studentID)
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
        if(registration.course_student.student_id.includes(studentID)) {
          registration.course_student.student_id.pop(studentID)
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
  console.log(course_id)
  try {
    let classmates = await registered_courses.findOne({_id:course_id})
    .populate('course_student.student_id')
    .select('course_student course_code');
    if(classmates.course_student.length > 0) {
      console.log(classmates)
      let course_code = classmates.course_code
      classmates.course_student.forEach(student => {
        student.password = course_code //using the password param to set course code since i can't create new property
      });
    }
    return classmates
  } catch (error) {
    console.log(error)
    throw error
  }
  
}