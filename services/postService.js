const Post = require('../models/posts');

function createPost(postInfo) {
  return Post.create(postInfo);
}

function getPost(id) {
  return Post.findById(id);
}

function getPosts() {
  return Post.find().populate('author', 'username avatarSrc');
}

function deletePost(id) {
  return Post.findByIdAndDelete(id);
}

function deleteAllPosts() {
  return Post.deleteMany();
}

module.exports = {
  createPost,
  getPost,
  getPosts,
  deletePost,
  deleteAllPosts
}