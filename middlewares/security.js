const { findUser } = require('../services/userService');
const { verify } = require('../services/hashService');
const { validationResult } = require('express-validator');
const {
  SignupError,
  LoginError,
  ProfileError,
  NotLoggedInError,
  AlreadyLoggedInError
} = require('./errors');

const Signup = {
  async validateSignup(req, res, next) {
    const user = await findUser(req.body.username);
    if (user) return next(new SignupError("Username already exists, please choose another one.", "USERNAME_EXISTS"));
    
    if (req.body.password !== req.body.repeat_password) {
      return next(new SignupError("Passwords don't match", "PASSWORD_MISMATCH"));
    }
    next();
  },

  handleValidation(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('pages/signup', {currentPage: 'signup', error: errors.array()[0].msg});
    }
    next();
  },

  handleErrors(err, req, res, next) {
    if (err instanceof AlreadyLoggedInError)
      return res.redirect('/');

    if (!(err instanceof SignupError)) return next(err);

    res.render('pages/signup', { currentPage: 'signup', error: err.message });
  }
}

const Login = {
  async validateLogIn(req, res, next) {
    if (req.session && req.session.user) return next(new AlreadyLoggedInError());

    const user = await findUser(req.body.username);
    if (!user)
      return next(new LoginError("Wrong username or password.", "WRONG_USR_OR_PASS"));

    const passwordVerify = await verify(req.body.password, user.password);

    if (!passwordVerify)
      return next(new LoginError("Wrong username or password.", "WRONG_USR_OR_PASS"));

    req.user = user;
    next();
  },

  handleErrors(err, req, res, next) {
    if (err instanceof AlreadyLoggedInError)
      return res.redirect('/');

    if (!(err instanceof LoginError)) return next(err);

    res.render('pages/login', {currentPage: 'login', error: err});
  }
}

const Profile = {

  async verifyProfileUpdate(req, res, next) {
    const user = await findUser(req.body.username);
    if (user && !user._id.equals(req.session.user._id)) // if Username exists and it's not the user's
      return next(new ProfileError("Username already exists, please choose another one.", "USERNAME_EXISTS"));  
    next();
  },

  handleValidation(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render('pages/profile', {
        username: req.session.user.username,
        error: errors.array()[0].msg,
        avatarSrc: req.session.user.avatarSrc
      });
    }

    next();
  },

  handleErrors(err, req, res, next) {
    if (err instanceof NotLoggedInError)
      return res.redirect('/login');

    if (!(err instanceof ProfileError)) return next(err);
    
    return res.render('pages/profile', {
      username: req.session.user.username,
      desc: req.session.user.description,
      error: err.message,
      avatarSrc: req.session.user.avatarSrc
    }); 
  }
}

const Write = {
  handleValidation(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render('pages/write', {
        avatarSrc: req.session.user.avatarSrc,
        currentPage: 'write',
        error: errors.array()[0].msg
      });
    }

    next();
  },

  handleErrors(err, req, res, next) {
    if (err instanceof NotLoggedInError)
      return res.redirect('/login');

    next(err);
  }
};

const Home = {
  handleErrors(err, req, res, next) {
    if (err instanceof NotLoggedInError)
      return res.redirect('/login');

    next(err);
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
  Write,
  Home,
  redirectToLogin,
  redirectToHome,
};