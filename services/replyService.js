const Comment = require('../models/comments');

function createReply(commentId, replyInfo) {
  return Comment.findByIdAndUpdate(commentId, { $push: {replies: replyInfo} });
}

function deleteReply(commentId, replyId, authorId) {
  return Comment.findByIdAndUpdate(commentId, {
    $pull: { replies: {_id: replyId, author: authorId }}
  });
}

module.exports = {
  createReply,
  deleteReply
};