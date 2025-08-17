const express = require('express');
const router = express.Router();

const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const signupRouter = require('./routes/signup');
const homeRouter = require('./routes/home');
const postsRouter = require('./routes/posts');
const profileRouter = require('./routes/profile');

router.use('/login', loginRouter);
router.use('/logout', logoutRouter);
router.use('/signup', signupRouter);
router.use('/posts', postsRouter);
router.use('/profile', profileRouter);
router.use('/', homeRouter);

module.exports = router;