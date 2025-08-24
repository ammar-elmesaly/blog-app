const express = require('express');
const router = express.Router();
const { Generic, redirectToLogin } = require('../middlewares/security');
const { createPost, getPosts, deleteAllPosts } = require('../services/postService');
const multer = require('multer');
const upload = multer({dest: './uploads/posts'});
const { body, validationResult } = require('express-validator');

router.get('/new', Generic.mustLogIn, (req, res) => {
  res.render('pages/write', {avatarSrc: req.session.user.avatarSrc, currentPage: 'write'});
});

router.post('/new',
  Generic.mustLogIn,

  upload.single('photo'),
  [
    body('title').notEmpty()
      .withMessage('A title is required'),

    body('content').notEmpty()
      .withMessage('Content is required')
  ],
  async (req, res, next) => {
  try {
    // TODO express-validator handling
    await createPost({
      author: req.session.user._id,
      title: req.body.title,
      content: req.body.content,
      date: new Date(),
      photoURL: req.file ? req.file.path : undefined,
    });
    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

router.get('/posts', async (req, res) => {
  const posts = await getPosts();
  res.send(posts);
});

router.get('/delete-all', async (req, res) => {
  await deleteAllPosts();
  res.redirect('/');
})

router.use(redirectToLogin);

module.exports = router;