const express = require('express');
const router = express.Router();

const { getUsers, addUser, findUser } = require('../services/userService');
const { body, validationResult } = require('express-validator');
const { checkUsernameExists, mustNotLogIn, validatePasswordRepeat, redirectToHome } = require('../middlewares/security');

router.post('/',
  body('username')
    .matches(/^[a-zA-Z0-9_]{3,20}$/)
    .withMessage('Username must be 3–20 characters and only contain letters, numbers, and underscores'),
  
  body('password')
    .matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/)
    .withMessage('Password must be at least 8 characters, contain one uppercase letter and one number'),
  
  mustNotLogIn,
  checkUsernameExists,
  validatePasswordRepeat,
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('pages/signup', {currentPage: 'signup', error: errors.array()[0].msg});
    }
    
    const user = await addUser(req.body.username, req.body.password);
    req.session.user = user;
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

router.use(redirectToHome);
router.use((err, req, res, next) => {
  res.render('pages/signup', { currentPage: 'signup', error: err });
});

module.exports = router;