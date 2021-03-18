const express = require('express');
const router = express.Router();
const studentService = require('./student.service');

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/getStudentData', getStudentData);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;

async function authenticate(req, res, next) {
  try {
    let user = await studentService.authenticate(req.body)
    res.json({
      success: true,
      msg: 'login successful',
      result: user
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      msg: error
    })
  }
}

async function register(req, res, next) {
  try {
    await studentService.create(req.body)
    res.json({
      success: true,
      msg: "registration successful"
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      msg: error
    })
  }
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

async function getStudentData(req, res, next) {
  try {
    let student = await studentService.getStudentById(req.user.sub)
    res.json({
      success: true,
      msg: 'student data collected',
      result: student
    })
  } catch (error) {
    res.sendStatus(400).send({
      success: false,
      msg: error
    })
  }
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}