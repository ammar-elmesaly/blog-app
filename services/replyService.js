const Comment = require('../models/comments');

function createReply(comment_id, replyInfo) {
  return Comment.findByIdAndUpdate(comment_id, { $push: {replies: replyInfo} });
}

module.exports = {
  createReply
};