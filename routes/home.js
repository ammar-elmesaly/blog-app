const express = require('express');
const router = express.Router();
const { isLoggedIn, redirectToLogin } = require('../middlewares/security');

router.get('/', isLoggedIn, (req, res) => {
  res.render('pages/home', {currentPage: 'home', username: req.session.user.username, logged: true});
});

router.use(redirectToLogin);

module.exports = router;