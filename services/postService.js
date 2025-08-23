const Post = require('../models/posts');

function createPost(postInfo) {
  return Post.create(postInfo);
}

function getPost(post_id) {
  return Post.findById(post_id);
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

module.exports = {
  createPost,
  getPost,
  getPosts,
  deletePost,
  deleteAllPosts,
  likePost
}