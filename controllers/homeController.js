const { timeAgo } = require('../services/dateService');
const postService = require('../services/postService');
const ObjectId = require('mongoose').Types.ObjectId;

function mapPosts(posts, userId) {
  posts.map(post => {
    post.dateFormatted = timeAgo(post.date);
    post.isAuthor = userId.toString() === post.author._id.toString();
    post.likesCount = post.likesAuthors.length;
    post.commentsCount = post.comments.length;
    post.isLiked = post.likesAuthors.includes(userId);
    return post;
  });

  return posts;
}

async function getHomePage(req, res) {
  let posts = await postService.getPosts();
  posts = mapPosts(posts, req.session.user._id);

  res.render('pages/home', {
    currentPage: 'home',
    avatarSrc: req.session.user.avatarSrc,
    posts
  });
}

async function deletePost (req, res) {
  if (!ObjectId.isValid(req.params.post_id))
    return res.sendStatus(400);

  const post = await postService.getPost(req.params.post_id);
  
  if (!post) 
    return res.sendStatus(404);

  if (!post.author.equals(req.session.user._id))
    return res.sendStatus(401);

  await postService.deletePost(req.params.post_id);
  res.sendStatus(200);
}

async function likePost (req, res) {
  if (!ObjectId.isValid(req.params.post_id))
    return res.sendStatus(400);

  const post = await postService.getPost(req.params.post_id);

  if (!post) 
    return res.sendStatus(404);

  let isLiked = post.likesAuthors.includes(req.session.user._id);

  let new_post;

  if (isLiked) {  // unlike
    new_post = await postService.likePost(post._id, req.session.user._id, true);
    isLiked = false;

  } else {  // like
    new_post = await postService.likePost(post._id, req.session.user._id, false);
    isLiked = true;
  }
  

  const likesCount = new_post.likesAuthors.length;

  res.status(200).json({
    likesCount,
    isLiked
  });
}

module.exports = {
  getHomePage,
  deletePost,
  likePost,
}