const express = require('express');
const router = express.Router();
const { Generic, Home } = require('../middlewares/security');
const {
  getHomePage,
  deletePost,
  deleteComment,
  likePost,
  likeComment
} = require('../controllers/homeController');

router.get('/', Generic.mustLogIn, getHomePage);

router.delete('/delete/post/:post_id', Generic.mustLogIn, deletePost);

router.delete('/delete/comment/:comment_id', Generic.mustLogIn, deleteComment);

router.put('/like/post/:post_id', Generic.mustLogIn, likePost);

router.put('/like/comment/:comment_id', Generic.mustLogIn, likeComment);

router.use(Home.handleErrors);

module.exports = router;