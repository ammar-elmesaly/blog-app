const express = require('express');
const router = express.Router();

const { validateLogin, redirectToLogin } = require('../services/guardRouteService');

router.get('/', validateLogin, (req, res) => {
  res.render('pages/profile', {username: req.session.user.username, logged: true});
});

router.use(redirectToLogin);  // redirects to login on error


module.exports = router;