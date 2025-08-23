const express = require('express');
const router = express.Router();
const { mustLogIn, redirectToLogin } = require('../middlewares/security');
const { getPost, getPosts, deletePost } = require('../services/postService');
const { timeAgo } = require('../services/dateService');
const ObjectId = require('mongoose').Types.ObjectId;

router.get('/', mustLogIn, async (req, res, next) => {
  try {
    let posts = await getPosts();
    posts = posts.map(post => {
      console.log(post._id);
      post.dateFormatted = timeAgo(post.date);
      post.isAuthor = req.session.user._id.toString() === post.author._id.toString() ;
      return post;
    });
    res.render('pages/home', {
      currentPage: 'home',
      avatarSrc: req.session.user.avatarSrc,
      posts
    });
  } catch (err) {
    next(err);
  }
});

router.delete('/delete/post/:id', mustLogIn, async (req, res, next) => {
  try {

    if (!ObjectId.isValid(req.params.id))
      return res.sendStatus(400);

    const post = await getPost(req.params.id);
    
    if (!post) 
      return res.sendStatus(404);

    if (!post.author.equals(req.session.user._id))
      return res.sendStatus(401);

    await deletePost(req.params.id);
    res.sendStatus(200);
    
  } catch (err) {
    next(err);
  }
});

router.use(redirectToLogin);

module.exports = router;