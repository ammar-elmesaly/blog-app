const express = require('express');
const router = express.Router();
const { Login, Generic } = require('../middlewares/security');

router.get('/', Generic.mustNotLogIn, (req, res) => {
  res.render('pages/login', {currentPage: 'login'});
});

router.post('/', Login.validateLogIn, (req, res) => {
    const user = req.user;
    req.session.user = user;
    res.redirect('/');
});

router.use(Login.handleErrors);


module.exports = router;