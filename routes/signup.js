const express = require('express');
const router = express.Router();

const { body } = require('express-validator');
const { Generic, Signup } = require('../middlewares/security');
const { addUser, getSignupPage } = require('../controllers/signupController');

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

  addUser
);

router.get('/', Generic.mustNotLogIn, getSignupPage);

router.get('/get', async (req, res) => {
  const response = await getUsers();
  res.send(response);
});

router.use(Signup.handleErrors);

module.exports = router;