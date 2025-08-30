const express = require('express');
const router = express.Router();
const { Generic, redirectToHome } = require('../middlewares/security');
const { getAboutPage } = require('../controllers/aboutController');

router.get('/', Generic.mustNotLogIn, getAboutPage);

router.use(redirectToHome);

module.exports = router;