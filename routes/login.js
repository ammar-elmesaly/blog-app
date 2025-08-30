const express = require('express');
const router = express.Router();
const { Login, Generic } = require('../middlewares/security');
const { getLoginPage, loginUser } = require('../controllers/loginController');

router.get('/', Generic.mustNotLogIn, getLoginPage);

router.post('/', Login.validateLogIn, loginUser);

router.use(Login.handleErrors);


module.exports = router;