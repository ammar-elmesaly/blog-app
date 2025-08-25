const express = require('express');
const router = express.Router();

const { getUsers, addUser, findUser } = require('../services/userService');
const { body } = require('express-validator');
const { Generic, Signup } = require('../middlewares/security');

router.post('/',
  [
    body('username')
      .matches(/^[a-zA-Z0-9_]{3,20}$/)
      .withMessage('Username must be 3–20 characters and only contain letters, numbers, and underscores'),
    
    body('password')
      .matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/)
      .withMessage('Password must be at least 8 characters, contain one uppercase letter and one number'),
  ],

  Generic.mustNotLogIn,
  Signup.handleValidation,
  Signup.validateSignup,
  
  async (req, res, next) => {
    try {
      const user = await addUser(req.body.username, req.body.password);
      req.session.user = user;
      res.redirect('/');
    } catch (err) {
      next(err);
    }
  }
);

router.get('/', Generic.mustNotLogIn, (req, res) => {
  res.render('pages/signup', {currentPage: 'signup'});
});

router.get('/get', async (req, res) => {
  try {
    const response = await getUsers();
    res.send(response);
    
  } catch (err) {
    next(err);
  }
});

router.use(Signup.handleErrors);

module.exports = router;