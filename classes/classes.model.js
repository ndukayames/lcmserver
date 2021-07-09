const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classchema = new Schema({
  hoc: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  lecturer: { type: Schema.Types.ObjectId, ref: "lecturer", required: true },
  course: { type: Schema.Types.ObjectId, ref: "registered_courses", required: true },
  duration : { type: Number, required: true },
  h : { type: String, required: true, unique: true },
  event : { type: Number, required: true, default: 0 },
  students : [{ type: Schema.Types.ObjectId, ref: "Student", required: false}],
  department: {type: String, required: true},
  level : { type: Number, required: true },
  class_id : { type: String, required: true },
  assignment: {type: Boolean, required: true},
  class_note : {type: String, required: false},
  lat : { type: Number, required: true },
  long : { type: Number, required: true },
  address: {type: String, required: true},
  date_started: { type: Date, default: Date.now }
})

module.exports = mongoose.model('classes', classchema);