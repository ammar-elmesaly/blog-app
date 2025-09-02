const Post = require('../models/posts');

function createPost(postInfo) {
  return Post.create(postInfo);
}

function getPost(post_id) {
  return Post.findById(post_id);
}

function getPostAndPopulate(post_id) {
  return Post.findById(post_id)
    .populate('author', 'username avatarSrc')
    .populate({
      path: 'comments',
      populate: { path: 'author', select: 'username avatarSrc' }
    });
}

function getPosts() {
  return Post.find().populate('author', 'username avatarSrc');
}

function deletePost(post_id) {
  return Post.findByIdAndDelete(post_id);
}

function deleteAllPosts() {
  return Post.deleteMany();
}

function likePost(post_id, user_id, remove) {
  if (remove) {

    return Post.findByIdAndUpdate(
      post_id,
      { $pull: { likesAuthors: user_id } },
      { new: true }
    );
    
  } else {

    return Post.findByIdAndUpdate(
      post_id,
      { $addToSet: { likesAuthors: user_id } },
      { new: true }
    );
  }
}

function updatePost(post_id, updates) {
  return Post.findByIdAndUpdate(post_id, updates);
}

function addCommentToPost(post_id, comment_id) {
  return Post.findByIdAndUpdate(
    post_id,
    { $addToSet: { comments: comment_id } },
    { new: true }
  );
}

function removeCommentFromPost(post_id, comment_id) {
  return Post.findByIdAndUpdate(
    post_id,
    { $pull: { comments: comment_id } },
    { new: true }
  );
}

module.exports = {
  createPost,
  getPost,
  getPosts,
  deletePost,
  deleteAllPosts,
  likePost,
  updatePost,
  getPostAndPopulate,
  addCommentToPost,
  removeCommentFromPost
}