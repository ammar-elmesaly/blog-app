const express = require('express');
const router = express.Router();
const { Generic } = require('../middlewares/security');

router.get('/', Generic.mustLogIn, (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

router.use((err, req, res, next) => {
  if (err.name !== "NotLoggedInError")
    return next(err);
  
  res.redirect('/login');
});

module.exports = router;