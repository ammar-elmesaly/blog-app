const express = require('express');
const router = express.Router();
const { findUser } = require('../services/userService');

router.get('/', (req, res) => {
  res.render('pages/login', {currentPage: 'login'});
});

router.post('/', validateLogin, (req, res) => {
  const user = req.user;
  req.session.user = {
    _id: user._id,
    username: user.username
  };
  res.redirect('/protected');
});

router.use((err, req, res, next) => {
  res.render('pages/login', {currentPage: 'login', error: err});
});

async function validateLogin(req, res, next) {
  if (req.body.user.length < 3 || req.body.password.length < 6) {
    return next('Username or password is too short');
  }

  const user = await findUser(req.body.user);
  if (!user) return next("User is not found");
  if (req.body.password !== user.password) return next("Wrong password");

  req.user = user;
  next();
}


module.exports = router;