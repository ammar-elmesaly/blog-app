const express = require('express');
const router = express.Router();
const { Write, Generic } = require('../middlewares/security');
const { createPost, getPosts, deleteAllPosts } = require('../services/postService');
const multer = require('multer');
const upload = multer({dest: './uploads/posts'});
const { body } = require('express-validator');

router.get('/new', Generic.mustLogIn, (req, res) => {
  res.render('pages/write', {avatarSrc: req.session.user.avatarSrc, currentPage: 'write'});
});

router.post('/new',
  Generic.mustLogIn,

  upload.single('photo'),

  [
    body('title')
      .notEmpty().withMessage('A title is required')
      .isLength({min: 10, max: 50})
        .withMessage('Title should be at least 10 character, and at most 50 characters.'),

    body('content').notEmpty()
      .withMessage('Content is required')
  ],

  Write.handleValidation,

  async (req, res, next) => {
    await createPost({
      author: req.session.user._id,
      title: req.body.title,
      content: req.body.content,
      date: new Date(),
      photoURL: req.file ? '/' + req.file.path : undefined,
    });
    res.redirect('/');
  }
);

router.get('/posts', async (req, res) => {
  const posts = await getPosts();
  res.send(posts);
});

router.get('/delete-all', async (req, res) => {
  await deleteAllPosts();
  res.redirect('/');
})

router.use(Write.handleErrors);

module.exports = router;