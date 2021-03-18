const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const registered_coursesSchema = new Schema({
  hoc: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  course_title : { type: String, required: true },
  course_code : { type: String, required: true },
  class_day : { type: String, required: true },
  course_student : { type: Array, required: false },
  level : { type: Number, required: true },
  course_lecturer : { type: Schema.Types.ObjectId, ref: "lecturer", required: true },
})

module.exports = mongoose.model('registered_courses', registered_coursesSchema);