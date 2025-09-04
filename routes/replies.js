const express = require('express');
const router = express.Router({mergeParams: true});
const { Generic, Replies } = require('../middlewares/security');
const { createReply, deleteReply, likeReply } = require('../controllers/repliesController');
const { body } = require('express-validator');

router.post('/reply/new',

  Generic.mustLogIn,

  body('content').notEmpty()
    .withMessage('Content is required'),
  
  Replies.handleValidation,
  createReply
);

router.delete('/reply/:reply_id/delete',
  Generic.mustLogIn,
  deleteReply
);

router.post('/reply/:reply_id/like', Generic.mustLogIn, likeReply);

router.use(Replies.handleErrors);

module.exports = router;