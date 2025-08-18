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

function updateDesc(id, desc) {
  return User.findByIdAndUpdate(id, {description: desc}, {new: true});
}

// function deleteAllUsers() {
//   return User.deleteMany();
// }

module.exports = {
  addUser,
  getUsers,
  findUser,
  updateDesc
}