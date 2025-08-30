function getLoginPage (req, res) {
  res.render('pages/login', {currentPage: 'login'});
}

function loginUser(req, res) {
    const user = req.user;
    req.session.user = user;
    res.redirect('/');
}

module.exports = {
  getLoginPage,
  loginUser
}