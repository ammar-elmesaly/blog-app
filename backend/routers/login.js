const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('pages/login', {currentPage: 'login'});
});

router.post('/', (req, res) => {
  console.log(req.body)
  res.send({user: req.body.user, pass: req.body.password});
});
module.exports = router;