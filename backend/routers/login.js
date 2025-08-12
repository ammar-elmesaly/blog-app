const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('pages/login', {currentPage: 'login'});
});

router.post('/', (req, res) => {
  res.render('pages/login', {currentPage: 'login', error: 'Invalid username or password'});
});

module.exports = router;