const mongoose = require('mongoose');
const { schema } = require('../users/student.model');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  in_class: { type: Boolean, required: true },
  class_id : { type: String, required: false },
  course: { type: Schema.Types.ObjectId, ref: "registered_courses", required: false },
  class_id : { type: String, required: false },
  title : { type: String, required: true },
  description : { type: String, required: true },
  url : { type: String, required: true },
  image_url : { type: String, required: true },
  start_date : { type: Date, default: Date.now, required: true },
  end_date : { type: Date, default: Date.now, required: true },
  students : {type: Schema.Types.ObjectId, ref: "Student", required: false },
  level : { type: Number, required: true },
  date_started: { type: Date, default: Date.now }
})  

module.exports = mongoose.model('course', courseSchema);