const commentService = require('../services/commentService');
const { timeAgo } = require('../services/dateService');
const ObjectId = require('mongoose').Types.ObjectId;

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

async function likeComment (req, res, next) {
  if (!ObjectId.isValid(req.params.comment_id))
    return res.sendStatus(400);

  const comment = await commentService.getComment(req.params.comment_id);

  if (!comment) 
    return res.sendStatus(404);

  let isLiked = comment.likesAuthors.includes(req.session.user._id);

  let new_comment;

  if (isLiked) {  // unlike
    new_comment = await commentService.likeComment(comment._id, req.session.user._id, true);
    isLiked = false;

  } else {  // like
    new_comment = await commentService.likeComment(comment._id, req.session.user._id, false);
    isLiked = true;
  }
  

  const likesCount = new_comment.likesAuthors.length;

  res.status(200).json({
    likesCount,
    isLiked
  });
}

async function deleteComment (req, res, next) {
  if (!ObjectId.isValid(req.params.comment_id) || !ObjectId.isValid(req.params.post_id))
    return res.sendStatus(400);

  const comment = await commentService.getComment(req.params.comment_id);
  const post = await postService.getPost(req.params.post_id);

  if (!comment || !post) 
    return res.sendStatus(404);

  if (!comment.author.equals(req.session.user._id))
    return res.sendStatus(401);

  await commentService.deleteComment(req.params.post_id, req.params.comment_id);
  res.sendStatus(200);
}

module.exports = {
  getComments,
  createComment,
  likeComment,
  deleteComment
};