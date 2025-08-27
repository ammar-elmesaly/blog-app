const Comment = require('../models/comments');
const { addCommentToPost, removeCommentFromPost } = require('../services/postService');

async function createComment(post_id, commentInfo) {
  const comment = await Comment.create(commentInfo);
  return addCommentToPost(post_id, comment._id);
}

module.exports = {
  createComment
};