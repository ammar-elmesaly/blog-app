const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer({dest: './uploads/avatars'});
const { Generic, Profile } = require('../middlewares/security');
const { body } = require('express-validator');
const { updateUserInfo, deleteUser } = require('../services/userService');

router.get('/', Generic.mustLogIn, (req, res) => {
  res.render('pages/profile', {
    username: req.session.user.username,
    desc: req.session.user.description,
    avatarSrc: req.session.user.avatarSrc
  });
});

router.post('/update',
  body('username')
    .matches(/^[a-zA-Z0-9_]{3,20}$/)
    .withMessage('Username must be 3–20 characters and only contain letters, numbers, and underscores'),

  Generic.mustLogIn,
  Profile.handleValidation,
  Profile.verifyProfileUpdate,
  
  async (req, res, next) => {
    const user = await updateUserInfo(req.session.user._id, {
      username: req.body.username,
      description: req.body.desc
    });

    req.session.user = user;
    res.redirect('/profile');
  }
);

router.post('/delete', Generic.mustLogIn, async (req, res, next) => {
  await deleteUser(req.session.user._id);
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

router.post('/upload', Generic.mustLogIn, upload.single('avatar'), async (req, res, next) => {
  const user = await updateUserInfo(req.session.user._id, {avatarSrc: '/' + req.file.path});
  req.session.user = user;
  res.redirect('/profile');
});

router.use(Profile.handleErrors);

module.exports = router;