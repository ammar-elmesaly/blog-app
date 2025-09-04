const replyService = require('../services/replyService');

async function createReply(req, res) {
  await replyService.createReply(req.params.comment_id, {
    author: req.session.user._id,
    content: req.body.content,
    date: new Date()
  });

  res.redirect(`/post/${req.query.post_id}/comments`);
}

module.exports = {
  createReply
}