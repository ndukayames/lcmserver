const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lecturerSchema = new Schema({
  username: { type: String, required: true },
  password : { type: String, required: true },
  firstName : { type: String, required: true },
  lastName : { type: String, required: true },
  campus : { type: String, required: false },
  faculty : { type: String, required: false },
  department : { type: String, required: false },
  course : { type: Array, required: false },
  complete_profile: { type: Boolean, default: false},
  createdDate: { type: Date, default: Date.now }
})

module.exports = mongoose.model('lecturer', lecturerSchema);