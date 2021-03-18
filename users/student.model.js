const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Studentschema = new Schema({
    matric_number: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type:String, required: true },
    phone_number: { type:String, required: true },
    campus: { type:String, required: false },
    faculty: { type:String, required: false },
    department : { type:String, required: false },
    registered_courses : { type:Array, required: false },
    level: { type:Number, required: false },
    complete_profile: { type:Boolean, default: false, required: false },
    type: { type:String, required: false },
    createdDate: { type: Date, default: Date.now }
});

Studentschema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});

module.exports = mongoose.model('Student', Studentschema);