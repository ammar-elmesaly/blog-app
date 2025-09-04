const express = require('express');
const router = express.Router({mergeParams: true});
const { Generic, Comments } = require('../middlewares/security');
const { createComment, getComments } = require('../controllers/commentsController');
const { body } = require('express-validator');

router.get('/comments', Generic.mustLogIn, Comments.verifyGetPost, getComments);

router.post('/comment/new',
  body('content').notEmpty()
    .withMessage('Content is required'),
  
  Comments.handleValidation,
  createComment
);

router.use(Comments.handleErrors);

module.exports = router;