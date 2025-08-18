const express = require('express');
const router = express.Router();

const { isLoggedIn, redirectToLogin } = require('../middlewares/security');
const { validationResult, body } = require('express-validator');
const { updateUserInfo } = require('../services/userService');

router.get('/', isLoggedIn, (req, res) => {
  res.render('pages/profile', {username: req.session.user.username, desc: req.session.user.description, logged: true});
});

router.post('/update',
  body('username')
    .matches(/^[a-zA-Z0-9_]{3,20}$/)
    .withMessage('Username must be 3–20 characters and only contain letters, numbers, and underscores'),

  isLoggedIn,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('pages/profile', {username: req.session.user.username, error: errors.array()[0].msg, logged: true});
    }
    const user = await updateUserInfo(req.session.user._id, {
      username: req.body.username,
      description: req.body.desc
    });

    req.session.user = user;
    res.redirect('/profile');
});

router.use(redirectToLogin);  // redirects to login on error


module.exports = router;