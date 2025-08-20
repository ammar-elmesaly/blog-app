const express = require('express');
const router = express.Router();
const { mustNotLogIn, redirectToHome } = require('../middlewares/security');

router.get('/', mustNotLogIn, (req, res) => {
  res.render('pages/about.pug', {
    currentPage: 'about'
  });
});

router.use(redirectToHome);

module.exports = router;