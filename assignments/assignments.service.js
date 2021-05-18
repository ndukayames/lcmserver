const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Assignments = require('./assignments.model')

module.exports = {
  create_assignment,
}

async function create_assignment(assignmentParam) {
  let newAssingment = await new Assignments(assignmentParam)
  if(newAssingment) {
    return newAssingment
  } else {
    throw "error creating assignment"
  }
}