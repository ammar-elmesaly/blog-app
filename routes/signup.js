const express = require('express');
const router = express.Router();

const { getUsers, addUser, findUser } = require('../services/userService');
const { body, validationResult } = require('express-validator');

router.post('/',
  body('username')
    .matches(/^[a-zA-Z0-9_]{3,20}$/)
    .withMessage('Username must be 3–20 characters and only contain letters, numbers, and underscores'),
  
  body('password')
    .matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/)
    .withMessage('Password must be at least 8 characters, contain one uppercase letter and one number'),
  
  validateSignup,
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('pages/signup', {currentPage: 'signup', error: errors.array()[0].msg});
    }
    
    const user = await addUser(req.body.username, req.body.password);
    req.session.user = {
      _id: user._id,
      username: user.username
    };
    res.redirect('/');
});

router.get('/', (req, res) => {
  if (req.session && req.session.user) res.redirect('/');
  else res.render('pages/signup', {currentPage: 'signup'});
});

router.get('/get', async (req, res) => {
  const response = await getUsers();
  res.send(response);
});

async function validateSignup(req, res, next) {

  if (req.session && req.session.user) return next("Already logged in");

  const user = await findUser(req.body.username);
  if (user) next("Username already exists, please choose another one");
  
  if (req.body.username.length < 3 || req.body.password.length < 6) {
    return next("Username or password is too short");
  }

  if (req.body.password !== req.body.repeat_password) {
    return next("Passwords don't match");
  }
  next();
}

router.use((err, req, res, next) => {
  if (err === "Already logged in") res.redirect('/?error=1');
  else res.render('pages/signup', { currentPage: 'signup', error: err });
});

module.exports = router;