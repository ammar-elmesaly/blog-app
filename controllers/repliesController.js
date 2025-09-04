const replyService = require('../services/replyService');
const commentService = require('../services/commentService');
const ObjectId = require('mongoose').Types.ObjectId;

async function createReply(req, res) {
  await replyService.createReply(req.params.comment_id, {
    author: req.session.user._id,
    content: req.body.content,
    date: new Date()
  });

  res.redirect(`/post/${req.query.post_id}/comments`);
}

async function deleteReply(req, res) {
  if (!ObjectId.isValid(req.params.comment_id) || !ObjectId.isValid(req.query.reply_id))
    return res.sendStatus(400);

  const comment = await commentService.getComment(req.params.comment_id);
  const reply = comment.replies.id(req.query.reply_id); 

  if (!comment || !reply) 
    return res.sendStatus(404);

  if (!reply.author.equals(req.session.user._id))
    return res.sendStatus(401);

  await replyService.deleteReply(req.params.comment_id, req.query.reply_id, req.session.user._id);
  res.sendStatus(200);

}

module.exports = {
  createReply,
  deleteReply
}