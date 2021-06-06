const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const assignmentSchema = new Schema({
  in_class: { type: Boolean, required: false },
  course: { type: Schema.Types.ObjectId, ref: "registered_courses", required: true },
  class_id : { type: String, required: false },
  title : { type: String, required: false },
  description : { type: String, required: false },
  url : { type: String, required: false },
  start_date : { type: Date, default: Date.now, required: false },
  end_date : { type: Date, required: false },
  students : [ { 
    student_id :{type: Schema.Types.ObjectId, ref: "Student", required: false },
    student_score: { type:Number, required: false },
    student_submission: { type:String, required: false }
  } ],
  department: { type: String, required: false },
  level : { type: Number, required: false },
  image : { type: String, required: false },
  status : { type: String, required: false },
  score: { type: Number, required: false}
})  
assignmentSchema.plugin(require('mongoose-autopopulate'));


module.exports = mongoose.model('assignments', assignmentSchema);
