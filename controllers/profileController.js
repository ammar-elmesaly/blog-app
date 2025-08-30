// const { updateUserInfo, deleteUser } = require('../services/userService');
const userService = require('../services/userService');
const hashService = require('../services/hashService');

function getProfilePage(req, res) {
  res.render('pages/profile', {
    username: req.session.user.username,
    desc: req.session.user.description,
    avatarSrc: req.session.user.avatarSrc
  });
}

async function updateUserInfo (req, res, next) {
  const user = await userService.updateUserInfo(req.session.user._id, {
    username: req.body.username,
    description: req.body.desc
  });

  req.session.user = user;
  res.redirect('/profile');
}

async function uploadAvatar(req, res, next) {
  const user = await userService.updateUserInfo(req.session.user._id, {avatarSrc: '/' + req.file.path});
  req.session.user = user;
  res.redirect('/profile');
}

async function changePassword(req, res, next) {
  const hashedPassword = await hashService.hash(req.body.new_password);
  await userService.updateUserInfo(req.session.user._id, {password: hashedPassword});
  res.redirect('/profile');
}

async function deleteUser (req, res, next) {
  await userService.deleteUser(req.session.user._id);
  req.session.destroy(() => {
    res.redirect('/login');
  });
}

module.exports = {
  getProfilePage,
  updateUserInfo,
  changePassword,
  deleteUser,
  uploadAvatar
}