const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const Student = db.Student;

module.exports = {
    authenticate,
    getAll,
    getStudentById,
    create,
    update,
    delete: _delete
};

async function authenticate({ matric_number, password }) {
    const student = await Student.findOne({ matric_number });
    if(student){
      if(bcrypt.compareSync(password, student.password)) {
        const token = jwt.sign({ sub: student.id }, config.secret, { expiresIn: '7d' });
        return {
          token
        };
      }else {
        throw "incorrect password"
      }
    }else {
      throw "incorrect matric number"
    }
}

async function getAll() {
    return await User.find();
}

async function getStudentById(id) {
    let student = await Student.findById(id);
    if(student) {
      console.log("student")
      const token = jwt.sign({ sub: student }, config.secret, { expiresIn: '7d' });
        return {
          token
        };
    }else {
      throw "invalid login token"
    }
}

async function create(userParam) {
    // validate
    if (await Student.findOne({ matric_number: userParam.matric_number })) {
        throw 'Student with matric number "' + userParam.matric_number + '" is already registered';
    }

    const student = new Student(userParam);

    // hash password
    if (userParam.password) {
        student.password = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await student.save();
}

async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}