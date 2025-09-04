const commentService = require('../services/commentService');
const { timeAgo } = require('../services/dateService');

function getComments(req, res, next) {
  const post = req.post;
  post.dateFormatted = timeAgo(post.date);

  post.comments.map(comment => {
    comment.dateFormatted = timeAgo(comment.date);
    comment.isLiked = comment.likesAuthors.includes(req.session.user._id);
    comment.likesCount = comment.likesAuthors.length;
    comment.isAuthor = req.session.user._id.toString() === comment.author._id.toString();
    comment.repliesCount = comment.replies.length;

    comment.replies.map(reply => {
      reply.dateFormatted = timeAgo(reply.date);
      reply.isLiked = reply.likesAuthors.includes(req.session.user._id);
      reply.likesCount = reply.likesAuthors.length;
      reply.isAuthor = req.session.user._id.toString() === reply.author._id.toString();
    });
  });
  
  res.render('pages/comments', {post, avatarSrc: req.session.user.avatarSrc, currentPage: 'home'});
}

async function createComment (req, res) {

  await commentService.createComment(req.params.post_id, {
    author: req.session.user._id,
    content: req.body.content,
    date: new Date(),
  });

  res.redirect(`/post/${req.params.post_id}/comments`);
}

module.exports = {
  getComments,
  createComment
};