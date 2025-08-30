const userService = require('../services/userService');

async function addUser (req, res, next) {
  const user = await userService.addUser(req.body.username, req.body.password);
  req.session.user = user;
  res.redirect('/');
}

function getSignupPage (req, res) {
  res.render('pages/signup', {currentPage: 'signup'});
}

module.exports = {
  addUser,
  getSignupPage
}