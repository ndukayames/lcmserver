const express = require('express');
const router = express.Router();

router.get( '/', test );

module.exports = router;

function test(req,res) {
  console.log('server test')
  res.json({
    success: true,
    msg: 'test successful',
  })
}