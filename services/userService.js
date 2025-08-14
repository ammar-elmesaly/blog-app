const User = require('../models/users');

function addUser(username, password) {
  return User.create({ username, password });
}

function getUsers() {
  return User.find();
}

function findUser(username) {
  return User.findOne({username});
}

module.exports = {
  addUser,
  getUsers,
  findUser
}