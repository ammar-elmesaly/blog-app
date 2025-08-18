const express = require('express');
const router = express.Router();
const { findUser } = require('../services/userService');
const { body, validationResult } = require('express-validator');
const { validateLogIn, redirectToHome } = require('../middlewares/security');

router.get('/', (req, res) => {
  if (req.session && req.session.user) res.redirect('/');
  else {
    res.render('pages/login', {currentPage: 'login'});
  }
});

router.post('/', validateLogIn, (req, res) => {
    const user = req.user;
    req.session.user = user;
    res.redirect('/');
});

router.use(redirectToHome);
router.use((err, req, res, next) => {
  res.render('pages/login', {currentPage: 'login', error: err});
});


module.exports = router;