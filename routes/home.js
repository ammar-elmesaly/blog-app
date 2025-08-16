const express = require('express');
const router = express.Router();

router.get('/', validateLogin, (req, res) => {
  const err = req.query.error === "1" ? "Already logged in" : undefined;
  res.render('pages/home', {currentPage: 'home', username: req.session.user.username, logged: req.isLoggedIn, error: err});
});

router.use((err, req, res, next) => {
  res.redirect('/login?error=2');
});

function validateLogin(req, res, next) {
  if (req.isLoggedIn) {
    next();
  } else {
    return next("You are not logged in.")
  }
}
module.exports = router;