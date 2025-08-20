const express = require('express');
const router = express.Router();
const { mustLogIn, redirectToLogin } = require('../middlewares/security');

router.get('/', mustLogIn, (req, res) => {
  res.render('pages/home', {
    currentPage: 'home',
    username: req.session.user.username,
    logged: true,
    avatarSrc: req.session.user.avatarSrc
  });
});

router.use(redirectToLogin);

module.exports = router;