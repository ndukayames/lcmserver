const express = require('express');
const router = express.Router();
const assignmentService = require('./assignments.service')

router.post('/create',create_assignment)

module.exports = router

async function create_assignment(req, res) {
  try {
    await assignmentService.create_assignment(req.body)
    res.send({
      success: true,
      msg: 'assignment created'
    })
  } catch (error) {
    // next(error)
    throw res.status(400).json({
      success: false,
      msg: error
    })
  }
}