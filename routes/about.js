const express = require('express');
const router = express.Router();
const { Generic, redirectToHome } = require('../middlewares/security');

router.get('/', Generic.mustNotLogIn, (req, res) => {
  res.render('pages/about.pug', {
    currentPage: 'about'
  });
});

router.use(redirectToHome);

module.exports = router;