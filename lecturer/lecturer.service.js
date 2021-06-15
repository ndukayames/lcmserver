const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Lecturer = require('./lecturer.model')
const registered_courses = require('../registered_courses/registered_courses.model')
const Classes = require('../classes/classes.model')
module.exports = {
  create,
  authenticate,
  getLecturerById,
  getLecturerAcademicData,
  complete_lecturer_signup,
  get_hoc_lecturer,
  get_lecturer_courses,
  get_lecturer_ongoing_classes
}

async function create(lecturerParam) {
  if (await Lecturer.findOne({ username: lecturerParam.username })) {
    throw 'lecturer with username "' + lecturerParam.username + '" is already registered';
}

const lecturer = new Lecturer(lecturerParam);

// hash password
if (lecturerParam.password) {
  lecturer.password = bcrypt.hashSync(lecturerParam.password, 10);
}
// save user
await lecturer.save();
}

async function authenticate({ username, password }) {
  const lecturer = await Lecturer.findOne({ username });
  if(lecturer){
    if(bcrypt.compareSync(password, lecturer.password)) {
      const token = jwt.sign({ sub: lecturer.id }, config.secret, { expiresIn: '7d' });
      return {
        token
      };
    }else {
      throw "incorrect password"
    }
  }else {
    throw "incorrect username"
  }
}

async function getLecturerById(id) {
  let lecturer = await Lecturer.findById(id);
  if(lecturer) {
    lecturer =  await lecturer.toObject()
    delete lecturer.password
    const token = jwt.sign({ sub: lecturer }, config.secret, { expiresIn: '7d' });
      return {
        token
      };
  }else {
    throw "invalid login token"
  }
}

async function getLecturerAcademicData(id) {
  let academicData = await Lecturer
  .findById(id)
  .select('campus faculty department')

  return academicData
}

async function complete_lecturer_signup(id,lectParam) {
  let completeProfile = await Lecturer
  .findByIdAndUpdate(
    id,
    {$set : lectParam},
    { omitUndefined: true, new: true }
    )
    if(completeProfile){
    console.log(completeProfile)
      return true
    } else {
      throw "lecturer not found"
    }
}

async function get_hoc_lecturer({department}) {
  // get lecturers in hoc department

  try {
    const lecturers = await Lecturer
    .find({department});

    if(lecturers.length < 1) {
      throw "no lecturers"
    } 
    return lecturers
  } catch (error) {

    throw error
  }
}

async function get_lecturer_courses(id) {
  try {
    lecturerClasses = await registered_courses
    .find({course_lecturer: id})
    .populate('course_lecturer course_student')
    if(lecturerClasses.length > 0) {
      return lecturerClasses
    } else {
      throw "You\'re not registered for this course"
    }
  } catch (error) {
    console.log(error)
    throw error
  }
  
}

async function get_lecturer_ongoing_classes(id) {
  try {
    ongoingClasses = await Classes
    .find({lecturer: id, event: 0})
    .populate({
      path: 'course',
      populate: { path: 'hoc', select: 'department'}
    })
    if(ongoingClasses.length > 0) {
      return ongoingClasses
    } else {
      throw "no ongoing classes at the moment"
    }
  } catch (error) {
    throw error
  }
}