const express = require('express');
const router = express.Router();

const { getUsers, addUser, findUser } = require('../services/userService');

router.post('/', validateSignup, async (req, res) => {
  const user = await addUser(req.body.user, req.body.password);
  req.session.user = {
    _id: user._id,
    username: user.username
  };
  res.redirect('/protected');
});

router.get('/', (req, res) => {
  res.render('pages/signup', {currentPage: 'signup'});
});

router.get('/get', async (req, res) => {
  const response = await getUsers();
  res.send(response);
});

async function validateSignup(req, res, next) {

  const user = await findUser(req.body.user);
  if (user) next("Username already exists, please choose another one");
  
  if (req.body.user.length < 3 || req.body.password.length < 6) {
    return next("Username or password is too short");
  }

  if (req.body.password !== req.body.repeat_password) {
    return next("Passwords don't match");
  }
  next();
}

router.use((err, req, res, next) => {
  res.render('pages/signup', { currentPage: 'signup', error: err });
});

module.exports = router;