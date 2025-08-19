const User = require('../models/users');
const { hash } = require('../services/hashService');

async function addUser(username, password) {
  const hashed = await hash(password);
  return User.create({ username, password: hashed });
}

function getUsers() {
  return User.find();
}

function findUser(username) {
  return User.findOne({username});
}

function updateUserInfo(id, updates) {
  return User.findByIdAndUpdate(id, updates, {new: true});
}

function deleteUser(id) {
  console.log(id);
  return User.findByIdAndDelete(id);
}

// function deleteAllUsers() {
//   return User.deleteMany();
// }

module.exports = {
  addUser,
  getUsers,
  findUser,
  updateUserInfo,
  deleteUser
}