const express = require('express');
const router = express.Router();
const { findUser } = require('../services/userService');
const { body, validationResult } = require('express-validator');
const { Login, Generic, redirectToHome } = require('../middlewares/security');

router.get('/', Generic.mustNotLogIn, (req, res) => {
  res.render('pages/login', {currentPage: 'login'});
});

router.post('/', Login.validateLogIn, (req, res) => {
    const user = req.user;
    req.session.user = user;
    res.redirect('/');
});

router.use(redirectToHome);
router.use((err, req, res, next) => {
  res.render('pages/login', {currentPage: 'login', error: err});
});


module.exports = router;