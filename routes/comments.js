const express = require('express');
const router = express.Router();
const { Generic, Comments } = require('../middlewares/security');
const { createComment } = require('../services/commentService');
const { timeAgo } = require('../services/dateService');
const { body } = require('express-validator');

router.get('/:id/comments', Generic.mustLogIn, Comments.verifyGetPost, (req, res, next) => {
  const post = req.post;
  post.dateFormatted = timeAgo(post.date);

  post.comments.map(comment => {
    comment.dateFormatted = timeAgo(comment.date);
    comment.isLiked = comment.likesAuthors.includes(req.session.user._id);
    comment.likesCount = comment.likesAuthors.length;
    comment.isAuthor = req.session.user._id.toString() === comment.author._id.toString();
  });
  
  res.render('pages/comments', {post, avatarSrc: req.session.user.avatarSrc, currentPage: 'home'});
});

router.post('/:id/comments/new',
  body('content').notEmpty()
    .withMessage('Content is required'),
  
  Comments.handleValidation,

  async (req, res) => {
    await createComment(req.params.id, {
      author: req.session.user._id,
      content: req.body.content,
      date: new Date(),
    });

    res.redirect(`/post/${req.params.id}/comments`);
  }
);

router.use(Comments.handleErrors);

module.exports = router;