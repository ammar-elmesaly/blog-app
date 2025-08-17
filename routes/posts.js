const express = require('express');
const router = express.Router();

router.get('/new', (req, res) => {
  res.send({hi: 'hi'});
});

module.exports = router;