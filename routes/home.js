const express = require('express');
const router = express.Router();
const { Generic, Home } = require('../middlewares/security');
const { getPost, getPosts, deletePost, likePost } = require('../services/postService');
const { getComment, likeComment, deleteComment } = require('../services/commentService');
const { timeAgo } = require('../services/dateService');
const ObjectId = require('mongoose').Types.ObjectId;

router.get('/', Generic.mustLogIn, async (req, res, next) => {
  let posts = await getPosts();
  posts = posts.map(post => {
    post.dateFormatted = timeAgo(post.date);
    post.isAuthor = req.session.user._id.toString() === post.author._id.toString();
    post.likesCount = post.likesAuthors.length;
    post.commentsCount = post.comments.length;
    post.isLiked = post.likesAuthors.includes(req.session.user._id);
    return post;
  });

  res.render('pages/home', {
    currentPage: 'home',
    avatarSrc: req.session.user.avatarSrc,
    posts
  });
});

router.delete('/delete/post/:id', Generic.mustLogIn, async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id))
    return res.sendStatus(400);

  const post = await getPost(req.params.id);
  
  if (!post) 
    return res.sendStatus(404);

  if (!post.author.equals(req.session.user._id))
    return res.sendStatus(401);

  await deletePost(req.params.id);
  res.sendStatus(200);
});

router.delete('/delete/comment/:comment_id', Generic.mustLogIn, async (req, res, next) => {
  if (!ObjectId.isValid(req.params.comment_id) || !ObjectId.isValid(req.query.post_id))
    return res.sendStatus(400);

  const comment = await getComment(req.params.comment_id);
  const post = await getPost(req.query.post_id);

  if (!comment || !post) 
    return res.sendStatus(404);

  if (!comment.author.equals(req.session.user._id))
    return res.sendStatus(401);

  await deleteComment(req.query.post_id, req.params.comment_id);
  res.sendStatus(200);
});


router.put('/like/post/:id', Generic.mustLogIn, async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id))
    return res.sendStatus(400);

  const post = await getPost(req.params.id);

  if (!post) 
    return res.sendStatus(404);

  let isLiked = post.likesAuthors.includes(req.session.user._id);

  let new_post;

  if (isLiked) {  // unlike
    new_post = await likePost(post._id, req.session.user._id, true);
    isLiked = false;

  } else {  // like
    new_post = await likePost(post._id, req.session.user._id, false);
    isLiked = true;
  }
  

  const likesCount = new_post.likesAuthors.length;

  res.status(200).json({
    likesCount,
    isLiked
  });

});

router.put('/like/comment/:id', Generic.mustLogIn, async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id))
    return res.sendStatus(400);

  const comment = await getComment(req.params.id);

  if (!comment) 
    return res.sendStatus(404);

  let isLiked = comment.likesAuthors.includes(req.session.user._id);

  let new_comment;

  if (isLiked) {  // unlike
    new_comment = await likeComment(comment._id, req.session.user._id, true);
    isLiked = false;

  } else {  // like
    new_comment = await likeComment(comment._id, req.session.user._id, false);
    isLiked = true;
  }
  

  const likesCount = new_comment.likesAuthors.length;

  res.status(200).json({
    likesCount,
    isLiked
  });

});

router.use(Home.handleErrors);

module.exports = router;