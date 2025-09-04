const express = require('express');
const router = express.Router();
const { Generic, Home } = require('../middlewares/security');
const {
  getHomePage,
  deletePost,
  likePost
} = require('../controllers/homeController');

router.get('/', Generic.mustLogIn, getHomePage);

router.delete('/delete/post/:post_id', Generic.mustLogIn, deletePost);

router.put('/like/post/:post_id', Generic.mustLogIn, likePost);

router.use(Home.handleErrors);

module.exports = router;