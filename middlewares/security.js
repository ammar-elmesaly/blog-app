const { findUser } = require('../services/userService');
const { verify } = require('../services/hashService');

async function checkUsernameExists(req, res, next) {
  const user = await findUser(req.body.username);
  if (user) return next("Username already exists, please choose another one.");
  next();
}

async function checkOtherUsernameExists(req, res, next) {
  // This checks if another username exists (not including the user)
  // Useful in edit profile utility

  const user = await findUser(req.body.username);
  if (user && !user._id.equals(req.session.user._id)) return next("Username already exists, please choose another one.");
  next();
}

function mustLogIn(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    return next("You are not logged in.")
  }
}

function mustNotLogIn(req, res, next) {
  if (req.session && req.session.user) {
    return next("You are already logged in.");
  } else {
    next();
  }
}

async function validatePasswordRepeat(req, res, next) {
  if (req.body.password !== req.body.repeat_password) {
    return next("Passwords don't match");
  }
  next();
}

async function validateLogIn(req, res, next) {
  if (req.session && req.session.user) return next('You are already logged in.');

  const user = await findUser(req.body.username);
  if (!user)
    return next("Wrong username or password");

  const passwordVerify = await verify(req.body.password, user.password);
  if (!passwordVerify)
    return next("Wrong username or password");

  req.user = user;
  next();
}

// Error handling middleware

function redirectToLogin(err, req, res, next) {
  if (err !== "You are not logged in.") return next(err);
  res.redirect('/login');
}

function redirectToHome(err, req, res, next) {
  if (err !== "You are already logged in.") return next(err);
  res.redirect('/');
}

module.exports = {
  checkUsernameExists,
  checkOtherUsernameExists,
  mustLogIn,
  mustNotLogIn,
  redirectToLogin,
  redirectToHome,
  validatePasswordRepeat,
  validateLogIn
};