const postService = require('../services/postService');

function getWritePage(req, res) {
  res.render('pages/write', {avatarSrc: req.session.user.avatarSrc, currentPage: 'write'});
}

async function createPost (req, res, next) {
  await postService.createPost({
    author: req.session.user._id,
    title: req.body.title,
    content: req.body.content,
    date: new Date(),
    photoURL: req.file ? '/' + req.file.path : undefined,
  });
  res.redirect('/');
}

module.exports = {
  getWritePage,
  createPost,
}