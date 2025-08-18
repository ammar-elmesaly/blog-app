function validateLogin(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    return next("You are not logged in.")
  }
}

function redirectToLogin(err, req, res, next) {
  console.log(err);
  res.redirect('/login');
}

module.exports = {
  validateLogin,
  redirectToLogin
}