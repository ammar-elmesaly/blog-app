const replyService = require('../services/replyService');
const commentService = require('../services/commentService');
const ObjectId = require('mongoose').Types.ObjectId;

async function createReply(req, res) {
  await replyService.createReply(req.params.comment_id, {
    author: req.session.user._id,
    content: req.body.content,
    date: new Date()
  });

  res.redirect(`/post/${req.params.post_id}/comments`);
}

async function deleteReply(req, res) {
  if (!ObjectId.isValid(req.params.comment_id) || !ObjectId.isValid(req.params.reply_id))
    return res.sendStatus(400);

  const comment = await commentService.getComment(req.params.comment_id);
  const reply = comment.replies.id(req.params.reply_id); 

  if (!comment || !reply) 
    return res.sendStatus(404);

  if (!reply.author.equals(req.session.user._id))
    return res.sendStatus(401);

  await replyService.deleteReply(req.params.comment_id, req.params.reply_id, req.session.user._id);
  res.sendStatus(200);

}

async function likeReply(req, res) {
    if (!ObjectId.isValid(req.params.comment_id) || !ObjectId.isValid(req.params.reply_id)) {
      return res.sendStatus(400);
    }
  
    const comment = await commentService.getComment(req.params.comment_id);
    if (!comment) 
      return res.sendStatus(404);

    const reply = comment.replies.id(req.params.reply_id); 

    if (!reply)
      return res.sendStatus(404);

    let isLiked = reply.likesAuthors.includes(req.session.user._id);
  
    let new_comment;

    if (isLiked) {  // unlike
      new_comment = await replyService.likeReply(comment._id, reply._id, req.session.user._id, true);
      isLiked = false;
  
    } else {  // like
      new_comment = await replyService.likeReply(comment._id, reply._id, req.session.user._id, false);
      isLiked = true;
    }
    
    const new_reply = new_comment.replies.id(req.params.reply_id); 
  
    const likesCount = new_reply.likesAuthors.length;
  
    res.status(200).json({
      likesCount,
      isLiked
    });
}

module.exports = {
  createReply,
  deleteReply,
  likeReply
}