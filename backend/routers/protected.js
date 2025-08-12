const express = require('express');
const router = express.Router();

router.get('/', validateLogin, (req, res) => {
  res.render('pages/protected', {currentPage: 'protected', username: req.session.user.username});
});

router.use((err, req, res, next) => {
  res.redirect('/login');
});

function validateLogin(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    return next("You are not logged in.")
  }
}
module.exports = router;