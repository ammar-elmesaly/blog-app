const express = require('express');
const router = express.Router();
const { isLoggedIn, redirectToLogin } = require('../middlewares/security');

router.get('/new', isLoggedIn, (req, res) => {
  res.send({hi: 'hi'});
});

router.use(redirectToLogin);

module.exports = router;