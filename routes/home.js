const express = require('express');
const router = express.Router();
const { mustLogIn, redirectToLogin } = require('../middlewares/security');
const { getPosts } = require('../services/postService');

router.get('/', mustLogIn, async (req, res) => {
  try {
    const posts = await getPosts();
    res.render('pages/home', {
      currentPage: 'home',
      username: req.session.user.username,
      avatarSrc: req.session.user.avatarSrc,
      posts
    });
  } catch (err) {
    next(err);
  }
});

router.use(redirectToLogin);

module.exports = router;