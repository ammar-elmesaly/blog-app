const express = require('express');
const router = express.Router();

const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const signupRouter = require('./routes/signup');
const homeRouter = require('./routes/home');
const writeRouter = require('./routes/write');
const profileRouter = require('./routes/profile');

router.use('/login', loginRouter);
router.use('/logout', logoutRouter);
router.use('/signup', signupRouter);
router.use('/write', writeRouter);
router.use('/profile', profileRouter);
router.use('/', homeRouter);

module.exports = router;