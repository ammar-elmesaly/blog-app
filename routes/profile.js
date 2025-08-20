const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer({dest: './uploads/avatars'});
const { mustLogIn, redirectToLogin, checkOtherUsernameExists } = require('../middlewares/security');
const { validationResult, body } = require('express-validator');
const { updateUserInfo, deleteUser } = require('../services/userService');

router.get('/', mustLogIn, (req, res) => {
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

  mustLogIn,
  checkOtherUsernameExists,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('pages/profile', {
        username: req.session.user.username,
        error: errors.array()[0].msg,
        avatarSrc: req.session.user.avatarSrc
      });
    }
    try {
      const user = await updateUserInfo(req.session.user._id, {
        username: req.body.username,
        description: req.body.desc
      });

      req.session.user = user;
      res.redirect('/profile');
    } catch (err) {
      next(err);
    }
});

router.post('/delete', mustLogIn, async (req, res, next) => {
  try {
    await deleteUser(req.session.user._id);
    req.session.destroy(() => {
      res.redirect('/login');
    });
  } catch (err) {
    next(err);
  }
});

router.post('/upload', mustLogIn, upload.single('avatar'), async (req, res, next) => {

  try {
    const user = await updateUserInfo(req.session.user._id, {avatarSrc: '/' + req.file.path});
    req.session.user = user;
    res.redirect('/profile');
  } catch (err) {
    next(err);
  }
});

router.use((err, req, res, next) => {
  if (err === "Username already exists, please choose another one.")
    return res.render('pages/profile', {
      username: req.session.user.username,
      desc: req.session.user.description,
      error: err,
      avatarSrc: req.session.user.avatarSrc
    });

  next(err);
});

router.use(redirectToLogin);  // redirects to login on error


module.exports = router;