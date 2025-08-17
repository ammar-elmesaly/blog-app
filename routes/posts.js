const express = require('express');
const router = express.Router();
const { validateLogin, redirectToLogin } = require('../services/guardRouteService');

router.get('/new', validateLogin, (req, res) => {
  res.send({hi: 'hi'});
});

router.use(redirectToLogin);

module.exports = router;