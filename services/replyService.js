const Comment = require('../models/comments');

function createReply(commentId, replyInfo) {
  return Comment.findByIdAndUpdate(commentId, { $push: {replies: replyInfo} });
}

function deleteReply(commentId, replyId, authorId) {
  return Comment.findByIdAndUpdate(commentId, {
    $pull: { replies: {_id: replyId, author: authorId }}
  });
}

async function likeReply(commentId, replyId, authorId, remove) {
  if (remove) {
    return Comment.findOneAndUpdate(
      { _id: commentId, "replies._id": replyId },
      { $pull: { "replies.$.likesAuthors": authorId} },
      { new: true}
    );
  }

  return Comment.findOneAndUpdate(
    { _id: commentId, "replies._id": replyId },
    { $addToSet: { "replies.$.likesAuthors": authorId } },
    { new: true }
  );
}


module.exports = {
  createReply,
  deleteReply,
  likeReply
};