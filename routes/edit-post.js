const express = require('express');
const router = express.Router();
const { Generic, EditPost } = require('../middlewares/security');
const { getEditPage, postEditUpdate } = require('../controllers/editController');
const { body } = require('express-validator');
const multer = require('multer');
let upload;

if (process.env.NODE_ENV === "PROD") {
  upload = multer({dest: '/tmp'});
} else {
  upload = multer({dest: './uploads/posts'});
}

router.get('/:post_id', Generic.mustLogIn, EditPost.verifyGetPost, getEditPage);

router.post(
  '/:post_id',
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

  EditPost.verifyUpdatePost,
  EditPost.handleValidation,
  postEditUpdate
);

router.use(EditPost.handleErrors);

module.exports = router;