const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Student = require('../users/student.model')

const hrcSchema = new Schema({
  hoc_id: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  original_course : { type: Schema.Types.ObjectId, ref: "registered_courses", required: true },
  level : { type: Number, required: true },
  course_lecturer : { type: Schema.Types.ObjectId, ref: "lecturer", required: true },
})

hrcSchema.methods.getCourseDetails =  async function() {
  let a = await Student.findById(hoc_id)
  console.log(a)
}

module.exports = mongoose.model('hrc', hrcSchema);