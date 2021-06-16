
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
  edit_assignment_image,
  get_student_assignment_scores
}

async function create_assignment(assignmentParam,file) {
  try {
    assignmentParam.image = "https://lasucm.herokuapp.com/" + file.path
    let newAssingment = new Assignments(assignmentParam)
    newAssingment.save().then((res)=>{
    },(error) => {
    })
  } catch (error) {
   throw error
  }
}
async function create_assignment_no_image(assignmentParam) {
  try {
    let newAssingment = new Assignments(assignmentParam)
    newAssingment.save().then((res)=>{

    },(error) => {

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
    // 
    assignmentParam.image = "https://lasucm.herokuapp.com/" + file.path
    const {_id} = assignmentParam
    let assignments = await Assignments.findByIdAndUpdate(
      _id,
      {$set : assignmentParam},
      { omitUndefined: true, new: true }
    )
    
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
  console.log('submitting')
  try {
    const {assignment_id,student_id} = assignmentParam
    
    const student_submission = "https://lasucm.herokuapp.com/" + file.path
    // let studentArray = [student_id,assignment_id]
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
async function score_student({assignment_id,student_id,score}){
  try {
    let student =  await Assignments.findOne({ _id:assignment_id, "students.student_id" : student_id}).then(res => {
      let sumn = res.students.find(reslt => {
        console.log(reslt.student_id == student_id,reslt.student_id, student_id)
        return reslt.student_id == student_id
      })
      sumn.student_score = score
      console.log(sumn)
      res.save()
    })

  } catch (error) {
    console.log(error)
    throw error
  }
}
async function get_student_assignment_scores({student_id,course_id}) {
  try {
    let scores = await Assignments.find({
      course: course_id,
      "students.student_id": student_id
    })
    .select("students")
    let counter = 0
    let allScore = []
    scores.forEach(res => {
      let ascore = res.students.find(res2 => {
        return res2.student_id._id == student_id
      })
      counter++
      allScore.push(ascore)
      if(counter == scores.length) {
        scores = allScore
      }
    })
    return scores
  } catch (error) {
    console.log(error)
    throw error
  }
}