const express = require('express');
const router = express.Router();
const hrcService = require('./hrc.service');
const Hrc = require('./hrc.model')

router.get('/', testThis);
module.exports = router;

function testThis(req, res, next) {
  Hrc.fullName('604f8f3095d00e61187b8a9c')
}