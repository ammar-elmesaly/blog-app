const express = require('express');
const router = express.Router();

const aboutRouter = require('./routes/about');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const signupRouter = require('./routes/signup');
const homeRouter = require('./routes/home');
const writeRouter = require('./routes/write');
const profileRouter = require('./routes/profile');
const commentsRouter = require('./routes/comments');
const repliesRouter = require('./routes/replies');
const editRouter = require('./routes/edit-post');

router.use('/about', aboutRouter);
router.use('/login', loginRouter);
router.use('/logout', logoutRouter);
router.use('/signup', signupRouter);
router.use('/write', writeRouter);
router.use('/profile', profileRouter);
router.use('/post/:post_id/', commentsRouter);
router.use('/post/:post_id/comment/:comment_id/', repliesRouter);
router.use('/edit', editRouter);
router.use('/', homeRouter);

module.exports = router;