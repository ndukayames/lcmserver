
const { populate } = require('./assignments.model')
const Assignments = require('./assignments.model')

module.exports = {
  create_assignment,
  get_recent_assignments,
  get_due_assignments,
  edit_assignment,
  cancel_assignment,
  end_assignment,
  get_course_assignments,
  get_assignments,
  submit_assignment,
  score_student,
  create_assignment_no_image,
  edit_assignment_no_image,
  edit_assignment_image
}

async function create_assignment(assignmentParam,file) {
  console.log(file)
  try {
    assignmentParam.image = "https://lasucm.herokuapp.com/" + file.path
    let newAssingment = new Assignments(assignmentParam)
    // console.log(newAssingment,assignmentParam)
    newAssingment.save().then((res)=>{
      console.log(res)
    },(error) => {
      console.log(error)
    })
  } catch (error) {
   throw error
  }
}
async function create_assignment_no_image(assignmentParam) {
  try {
    let newAssingment = new Assignments(assignmentParam)
    // console.log(newAssingment,assignmentParam)
    newAssingment.save().then((res)=>{
      console.log(res)
    },(error) => {
      console.log(error)
    })
  } catch (error) {
   throw error
  }
}

async function get_recent_assignments({department}) {
  //for lecturers
  try {
    const recentss = await Assignments.find({
      department, status : "recent"
    })
    .populate({
      path: 'course',
      select: "course_code course_title course_student course_lecturer",
      populate: { path: 'course_student course_lecturer hoc'},
      })
    .populate('students.student_id', '-password');
      console.log(recentss.course)
    if(recentss.length > 0) {
      recentss.forEach(assignment => {
        assignment.course.hoc.forEach(hoc => {
          hoc.password = "lol"
        });
        assignment.course.course_student.forEach(hoc => {
          hoc.password = "lol"
        });
        assignment.course.course_lecturer.forEach(hoc => {
          hoc.password = "lol"
        });
      });
      console.log(1,recentss,department)
      return recentss
    }
  } catch (error) {
    console.log(error)
    throw error
  }
  
}
async function get_due_assignments({department}) {
  //for lecturers
  try {
    const recentss = await Assignments.find({
      department, status : "due"
    })
    .populate({
      path: 'course',
      select: "course_code course_title course_student course_lecturer",
      populate: { path: 'course_student course_lecturer hoc'},
      })
    .populate('students', '-password');
    if(recentss.length > 0) {
      recentss.forEach(assignment => {
        assignment.course.hoc.forEach(hoc => {
          hoc.password = "lol"
        });
        assignment.course.course_student.forEach(hoc => {
          hoc.password = "lol"
        });
        assignment.course.course_lecturer.forEach(hoc => {
          hoc.password = "lol"
        });
      });
      return recentss
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

async function edit_assignment_no_image(assignment) {
  try {
    const {_id} = assignment
    let assignments = await Assignments.findByIdAndUpdate(
      _id,
      {$set : assignment},
      { omitUndefined: true, new: true }
    )
  } catch (error) {
    throw error
  }
}
async function edit_assignment_image(assignmentParam,file) {
  try {
    // console.log(assignmentParam)
    assignmentParam.image = "https://lasucm.herokuapp.com/" + file.path
    const {_id} = assignmentParam
    let assignments = await Assignments.findByIdAndUpdate(
      _id,
      {$set : assignmentParam},
      { omitUndefined: true, new: true }
    )
    console.log(assignments)
  } catch (error) {
    throw error
  }
}

async function edit_assignment(assignment) {
  try {
    const {_id} = assignment
    await Assignments.findByIdAndUpdate(
      _id,
      {$set : assignment},
      { omitUndefined: true, new: true }
    )
  } catch (error) {
    throw error
  }
}

async function cancel_assignment(_id) {
  try {
    await Assignments.findByIdAndUpdate(
      _id,
      {$set : {status: "canceled"}},
      { omitUndefined: true, new: true }
    )
  } catch (error) {
    throw error
  }
}
async function end_assignment(_id) {
  try {
    await Assignments.findByIdAndUpdate(
      _id,
      {$set : {status: "due"}},
      { omitUndefined: true, new: true }
    )
  } catch (error) {
    throw error
  }
}
async function get_course_assignments({course_id}) {
  try {
    course_assignment = await Assignments.find({course: course_id})
    .populate({
      path: 'course',
      populate: { path: 'course_student course_lecturer hoc'},
    })
    .populate('students.student_id')
    if(course_assignment.length > 0) {
      course_assignment.forEach(assignment => {
        assignment.course.hoc.forEach(hoc => {
          hoc.password = "lol"
        });
        assignment.course.course_student.forEach(hoc => {
          hoc.password = "lol"
        });
        assignment.course.course_lecturer.forEach(hoc => {
          hoc.password = "lol"
        });
      });
      return course_assignment
    }
  } catch (error) {
    throw error
  }
}
async function get_assignments() {
  return Assignments.find({})
  .select('-image')
}
async function submit_assignment(assignmentParam,file) {
  try {
    const {assignment_id,student_id} = assignmentParam
    console.log(file,assignment_id,student_id)
    const student_submission = "https://lasucm.herokuapp.com/" + file.path
    let studentArray = [student_id,assignment_id]
    let student = await Assignments.findByIdAndUpdate(
      assignment_id,
      {
        $push : {
        students: [{student_id,student_submission}]
        }
      },
      { omitUndefined: true, new: true }
    )
    console.log(student)
  } catch (error) {
    throw error
  }
}
async function score_student({student_id,score}){
  try {
    let student =  await Assignments.findOne({ "students.student_id" : student_id})
    .select('students')
    studentScoree = student.students.find(student => {
      return student.student_id == student_id
    });
    
    studentScoree.student_score = score
    console.log(student_id,score)
    console.log(student.save(),studentScoree)

    student.save();
  } catch (error) {
    console.log(error)
  }
 
}