const express = require('express');
const router = express.Router();
const { Write, Generic } = require('../middlewares/security');
const { body } = require('express-validator');
const multer = require('multer');
const upload = multer({dest: './uploads/posts'});
const {
  getWritePage,
  createPost
} = require('../controllers/writeController');

router.get('/new', Generic.mustLogIn, getWritePage);

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
  createPost
);

/*
router.get('/posts', async (req, res) => {
  const posts = await getPosts();
  res.send(posts);
});

router.get('/delete-all', async (req, res) => {
  await deleteAllPosts();
  res.redirect('/');
})
*/

router.use(Write.handleErrors);

module.exports = router;