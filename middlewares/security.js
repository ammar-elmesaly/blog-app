const { findUser } = require('../services/userService');
const { verify } = require('../services/hashService');

class NotLoggedInError extends Error {
  constructor(message = "You are not logged in.") {
    super(message);
    this.name = "NotLoggedInError";
  }
}

class AlreadyLoggedInError extends Error {
  constructor(message = "You are already logged in.") {
    super(message);
    this.name = "AlreadyLoggedInError";
  }
}

class UsernameExistsError extends Error {
  constructor(message = "Username already exists, please choose another one.") {
    super(message);
    this.name = "UsernameExistsError";
  }
}

class UsernameOrPasswordError extends Error {
  constructor(message = "Wrong username or password.") {
    super(message);
    this.name = "UsernameOrPasswordError";
  }
}

class PasswordMatchingError extends Error {
  constructor(message = "Passwords don't match") {
    super(message);
    this.name = "PasswordMatchingError";
  }
}

const Signup = {
  async checkUsernameExists(req, res, next) {
    const user = await findUser(req.body.username);
    if (user) return next(new UsernameExistsError());
    next();
  },

  async validatePasswordRepeat(req, res, next) {
    if (req.body.password !== req.body.repeat_password) {
      return next(new PasswordMatchingError());
    }
    next();
  }
}

const Login = {
  async validateLogIn(req, res, next) {
    if (req.session && req.session.user) return next(new AlreadyLoggedInError());

    const user = await findUser(req.body.username);
    if (!user)
      return next(new UsernameOrPasswordError());

    const passwordVerify = await verify(req.body.password, user.password);
    if (!passwordVerify)
      return next(new UsernameOrPasswordError());

    req.user = user;
    next();
  }
}

const Profile = {
  async checkOtherUsernameExists(req, res, next) {
    // This checks if another username exists (not including the user)
    // Useful in edit profile utility

    const user = await findUser(req.body.username);
    if (user && !user._id.equals(req.session.user._id)) return next(new UsernameExistsError());
    next();
  }
}

const Generic = {
  mustLogIn(req, res, next) {
    if (req.session && req.session.user) {
      next();
    } else {
      return next(new NotLoggedInError())
    }
  },

  mustNotLogIn(req, res, next) {
    if (req.session && req.session.user) {
      return next(new AlreadyLoggedInError());
    } else {
      next();
    }
  }
}


// Error handling middleware

function redirectToLogin(err, req, res, next) {
  if (!(err instanceof NotLoggedInError)) return next(err);
  res.redirect('/login');
}

function redirectToHome(err, req, res, next) {
  if (!(err instanceof AlreadyLoggedInError)) return next(err);
  res.redirect('/');
}

module.exports = {
  Generic,
  Login,
  Signup,
  Profile,
  redirectToLogin,
  redirectToHome,
};