const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const Student = require('./student.model');

module.exports = {
    authenticate,
    getStudentById,
    create,
    get_registered_courses,
    check_complete_profile,
    update_profile
};

async function authenticate({ matric_number, password }) {
    const student = await Student.findOne({ matric_number });
    if(student){
      if(bcrypt.compareSync(password, student.password)) {
        const token = jwt.sign({ sub: student.id }, config.secret, { expiresIn: '7d' });
        return {
          token
        };
      }else {
        throw "incorrect password"
      }
    }else {
      throw "incorrect matric number"
    }
}

async function getStudentById(id) {
    let student = await Student.findById(id);
    if(student) {
      student =  await student.toObject()
      delete student.password
      const token = jwt.sign({ sub: student }, config.secret, { expiresIn: '7d' });
        return {
          token
        };
    }else {
      throw "invalid login token"
    }
}

async function create( userParam ) {
    // validate
    if (await Student.findOne({ matric_number: userParam.matric_number })) {
        throw 'Student with matric number "' + userParam.matric_number + '" is already registered';
    }

    const student = new Student(userParam);

    // hash password
    if (userParam.password) {
        student.password = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await student.save();
}

async function get_registered_courses( {_id} ) {
  
  try {
    let registered_courses = await Student.findById(_id)
    .select('registered_courses')
    if( registered_courses.id ) { 

    } 
    if(registered_courses.registered_courses.length < 1) {

  
      throw "no registered courses found"
    } else {

      return registered_courses
    }
  } catch (err) {
    throw err
  }
}

async function check_complete_profile( {matric_number} ) {
  
  try {
    let student = await Student.findOne({matric_number}).select('complete_profile')
    if( student._id) {
      return true
    } else {
    }
  } catch (error) {
    throw "request error"
  }
}

async function update_profile (studentID,studentParam){
  try {
    if( studentParam.password ) {
      studentParam.password = bcrypt.hashSync(studentParam.password, 10)
    }
    await Student.findByIdAndUpdate(
      studentID,
      { $set : studentParam},
      { omitUndefined: true, new: true }
    )
  } catch (error) {
    throw " error updating profile"
  }
}