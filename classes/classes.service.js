const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Classes =  require('./classes.model');

module.exports = {
  end_class,
  create_class,
  start_class,
  cancel_class,
  removeStudentFromClass,
  getMyOnGoingClasses,
  mark_attendance,
  check_if_in_class,
  get_other_classes,
  get_class_history,
  check_course_attendance,
  get_dept_attendance_log,
  get_lect_dept_attendance_log
}

async function create_class(classParam) {
  let new_class = new Classes(classParam)
  try {
    await new_class.save()
  } catch (error) {
    console.log(error)
    throw error
  }
}

async function start_class(hoc,class_id) {
  let theClass = await Classes.findOneAndUpdate(
    {hoc,class_id},
    {event: "0"},
    { omitUndefined: true, new: true }
  )
  if(theClass){
    return true
  } else {
    throw "could not start class"
  }
}

async function cancel_class( class_id ) {

  let theClass = await Classes.findByIdAndUpdate(
    class_id,
    {$set : {event: 2}},
    { omitUndefined: true, new: true }
  ) 
  
  if(theClass){
    return true
  } else {
    throw "class not found"
  }
}

async function end_class( class_id ) {

  let theClass = await Classes.findByIdAndUpdate(
    class_id,
    {$set : {event: 1}},
    { omitUndefined: true, new: true }
  )

  if(theClass){
    return true
  } else {
    throw "class not found"
  }
}

async function removeStudentFromClass( {class_id,student} ) {
  let theClass =  await Classes.findOne({
    class_id,
    students: student
  })
  theClass.students.pull(student)
  theClass.save()
}

async function getMyOnGoingClasses( { department, level } ) {
  let theClass = await Classes
  .find()
  .populate({
    path: 'hoc',
    select: '-password',
    match: { department, level },
  })
  .populate('course')
  .populate('lecturer', '-password')
  // 
  try {
  let myClasses =  theClass.filter(aclass => {
      
      return aclass.hoc != null && aclass.hoc.level === level && aclass.hoc.department === department && aclass.event === 0
  })
  myClasses.forEach(myClass => {
    myClass.hoc = myClass.hoc.id
  })
    if(myClasses.length > 0) {
      return myClasses
    }
  } catch (error) {
    throw error
  }
}

async function mark_attendance( students, {_id,class_id}) {
  try {
    await Classes.findByIdAndUpdate(
      _id,
      {$push : { students }}
    )
    return true
  } catch (error) {
    
    throw " could not mark attendance"
  }
}

async function check_if_in_class(_id, { class_id } ) {
  try{
    let classes = await Classes.findOne({_id: class_id,students: _id});
    if(classes.students) {
      
      return true;
    } else {
      throw "can't find student"
    }
  }
  catch (error) {
    
    throw "can't find student"
  }
}

async function get_other_classes( {department,class_id} ) {
  
  try {
    let otherClasses = await Classes
    .find({class_id})
    .populate({
      path: 'hoc',
      select: 'department -_id',
      match: {department: -department}
    })
    .select('hoc -_id')
    if(otherClasses[0].hoc === null ) {
      throw " no other department in this class"
    }
    if(otherClasses.length < 1) {
      throw " no other department in this class"
    }
    
    return otherClasses
  } catch (error) {
    
    throw error
  }
}

async function get_class_history({class_id,course_code,department}) {
  //for students
  try {
    let theClass = await Classes
    .find()
    .populate({
      path: 'hoc',
      match: {department: department}
    })
    .populate('students')
    .populate({
      path: "course",
      populate: {path: "course_student"},
      populate: {path: "hoc", select: "department"},
      match: {course_code: course_code}
    })
    .populate('lecturer')
    if(theClass.length < 1 ) {
      throw "no class history"
    } else {
      return theClass
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

async function check_course_attendance(_id,{class_id}) {

 try {
   let checker = await Classes.find(
     {class_id, students: _id}
   )
   if(checker.length > 0) {
    return true
   } else {
     throw "student does not have an attendance for this class"
   }
 } catch (error) {
   console.log(error)
   throw error
 }
}

async function get_dept_attendance_log(_id,{class_id}) {
  //for hocs
  try {
    let checker = await Classes.findOne({class_id: class_id, hoc: _id})
    .populate('students', '-password')
    .select('students')
    if(checker) {

      return checker
    } else {
      throw "could not retreive log"
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

async function get_lect_dept_attendance_log({department,class_id}) {

  //for lecturers to get attendance logs for specified departments
  try {
    let logs = await Classes.findOne({department,class_id})
    .populate('students', '-password')
    .select('students')
    console.log(logs)
    if(logs) {
      console.log(logs)
      return logs
    } else {
      throw "no logs found"
    }
  } catch (error) {
    throw error
  }
}

// async function get_single_class_history({course_code,department}) {
//   try {
//     let theClass = await Classes
//     .find()
//     .populate({
//       path: 'lecturer',
//       match: {department: department}
//     })
//     .populate('students')
//     .populate({
//       path: "course",
//       populate: {path: "course_student"},
//       match: {course_code: course_code}
//     })
//     if(theClass.length < 1 ) {
//       throw "no class history"
//     } else {
//       return theClass
//     }
//   } catch (error) {
//     console.log(error)
//     throw error
//   }
// }