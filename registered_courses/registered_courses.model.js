const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Student = require('../users/student.model')

const registered_coursesSchema = new Schema({
  hoc: [{ type: Schema.Types.ObjectId, ref: "Student", required: false }] ,
  course_title : { type: String, required: true, unique: true },
  course_code : { type: String, required: true, unique: true },
  course_time : {type: Date, required: true},
  my_course : {type: Boolean, required: true},
  class_day : { type: String, required: true },
  course_student : [{ 
    student_id :{type: Schema.Types.ObjectId, ref: "Student", required: false },
    student_score: { type:Number, required: false },
  }],
  level : { type: Number, required: true },
  course_lecturer : [{ type: Schema.Types.ObjectId, ref: "lecturer", required: false }],
})


module.exports = mongoose.model('registered_courses', registered_coursesSchema);