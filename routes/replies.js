const express = require('express');
const router = express.Router();
const { Generic, Replies } = require('../middlewares/security');
const { createReply } = require('../controllers/repliesController');
const { body } = require('express-validator');

router.post('/:comment_id/replies/new',

  Generic.mustLogIn,

  body('content').notEmpty()
    .withMessage('Content is required'),
  
  Replies.handleValidation,
  createReply
);

router.use(Replies.handleErrors);

module.exports = router;