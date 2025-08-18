const express = require('express');
const router = express.Router();
const { mustLogIn, redirectToLogin } = require('../middlewares/security');

router.get('/new', mustLogIn, (req, res) => {
  res.send({hi: 'hi'});
});

router.use(redirectToLogin);

module.exports = router;