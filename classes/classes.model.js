const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  hoc: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  lecturer: { type: Schema.Types.ObjectId, ref: "lecturer", required: true },
  course: { type: Schema.Types.ObjectId, ref: "registered_courses", required: true },
  duration : { type: String, required: true },
  h : { type: String, required: true },
  event : { type: String, required: true },
  students : { type: Array, required: false },
  level : { type: Number, required: true },
  class_id : { type: String, required: true },
  date_started: { type: Date, default: Date.now }
})

module.exports = mongoose.model('course', courseSchema);