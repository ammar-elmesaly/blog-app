const { findUser } = require('../services/userService');

async function checkUsernameExists(req, res, next) {
  const user = await findUser(req.body.username);
  if (user) next("Username already exists, please choose another one");
}

function isLoggedIn(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    return next("You are not logged in.")
  }
}

async function validatePasswordRepeat(req, res, next) {
  if (req.body.password !== req.body.repeat_password) {
    return next("Passwords don't match");
  }
  next();
}


function redirectToLogin(err, req, res, next) {
  console.log(err);
  res.redirect('/login');
}

module.exports = {
  checkUsernameExists,
  isLoggedIn,
  redirectToLogin,
  validatePasswordRepeat
};