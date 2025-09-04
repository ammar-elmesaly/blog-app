const Comment = require('../models/comments');
const { addCommentToPost, removeCommentFromPost } = require('../services/postService');

async function createComment(post_id, commentInfo) {
  const comment = await Comment.create(commentInfo);
  return addCommentToPost(post_id, comment._id);
}

async function getComment(comment_id) {
  return Comment.findById(comment_id);
}

function likeComment(comment_id, user_id, remove) {
  if (remove) {

    return Comment.findByIdAndUpdate(
      comment_id,
      { $pull: { likesAuthors: user_id } },
      { new: true }
    );
  }
  
  return Comment.findByIdAndUpdate(
    comment_id,
    { $addToSet: { likesAuthors: user_id } },
    { new: true }
  );
}

async function deleteComment(post_id, comment_id) {
  const comment = await Comment.findByIdAndDelete(comment_id);
  return removeCommentFromPost(post_id, comment_id);
}

module.exports = {
  createComment,
  getComment,
  likeComment,
  deleteComment
};