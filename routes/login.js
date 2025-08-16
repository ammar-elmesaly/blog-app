const express = require('express');
const router = express.Router();
const { findUser } = require('../services/userService');
const { body, validationResult } = require('express-validator');

router.get('/', (req, res) => {
  if (req.isLoggedIn) res.redirect('/');
  else {
    const err = req.query.error === "2" ? "You are not logged in" : undefined;
    res.render('pages/login', {currentPage: 'login', error: err});
  }
});

router.post('/', validateLogin, (req, res) => {
    const user = req.user;
    req.session.user = {
      _id: user._id,
      username: user.username
    };
    res.redirect('/');
});

router.use((err, req, res, next) => {
  if (err === "Already logged in") res.redirect('/?error=1');
  else res.render('pages/login', {currentPage: 'login', error: err});
});

async function validateLogin(req, res, next) {
  if (req.isLoggedIn) return next('Already logged in');

  const user = await findUser(req.body.user);
  if (!user || req.body.password !== user.password) return next("Wrong username or password");

  req.user = user;
  next();
}


module.exports = router;