const express = require('express');
const router = express.Router();
const { findUser } = require('../services/userService');
const { body, validationResult } = require('express-validator');
const { verify } = require('../services/hashService');

router.get('/', (req, res) => {
  if (req.session && req.session.user) res.redirect('/');
  else {
    res.render('pages/login', {currentPage: 'login'});
  }
});

router.post('/', isLoggedIn, (req, res) => {
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

async function isLoggedIn(req, res, next) {
  if (req.session && req.session.user) return next('Already logged in');

  const user = await findUser(req.body.username);
  if (!user)
    return next("Wrong username or password");

  const passwordVerify = await verify(req.body.password, user.password);
  if (!passwordVerify)
    return next("Wrong username or password");

  req.user = user;
  next();
}


module.exports = router;