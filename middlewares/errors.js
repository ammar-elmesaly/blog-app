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

class SignupError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.name= "SignupError";
  }
}

class LoginError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.name= "LoginError";
  }
}

class ProfileError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.name= "ProfileError";
  }
}

module.exports = {
  SignupError,
  LoginError,
  ProfileError,
  NotLoggedInError,
  AlreadyLoggedInError,
};