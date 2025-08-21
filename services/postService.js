const Post = require('../models/posts');

function createPost(postInfo) {
  return Post.create(postInfo);
}

function getPosts() {
  return Post.find().populate('author', 'username avatarSrc');
}

function deleteAllPosts() {
  return Post.deleteMany();
}

module.exports = {
  createPost,
  getPosts,
  deleteAllPosts
}