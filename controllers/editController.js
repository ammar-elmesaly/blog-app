const { updatePost } = require('../services/postService');

function getEditPage (req, res) {
  res.render('pages/edit-post', {
    avatarSrc: req.session.user.avatarSrc,
    post: req.post,
    error: req.query.error
  });
}

async function postEditUpdate(req, res) {

  let updates = {
    title: req.body.title,
    content: req.body.content
  };

  if (req.file)
    updates.photoURL = '/' + req.file.path;

  else if (req.body.photoStatus === 'not_uploaded')
    updates.photoURL = null;

  await updatePost(req.params.post_id, updates);
  res.redirect('/');
}

module.exports = {
  getEditPage,
  postEditUpdate
}