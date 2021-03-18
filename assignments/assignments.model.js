const mongoose = require('mongoose');
const { schema } = require('../users/student.model');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  in_class: { type: Boolean, required: true },
  class: { type: Schema.Types.ObjectId, ref: "classes", required: true },
  course: { type: Schema.Types.ObjectId, ref: "registered_courses", required: true },
  image_url : { type: String, required: true },
  description : { type: String, required: true },
  url : { type: String, required: true },
  start_date : { type: Date, default: Date.now, required: true },
  end_date : { type: Date, default: Date.now, required: true },
  students : {type: [schema.Types.ObjectId], ref: "Student", required: false },
  level : { type: Number, required: true },
  date_started: { type: Date, default: Date.now }
}) 

module.exports = mongoose.model('course', courseSchema);