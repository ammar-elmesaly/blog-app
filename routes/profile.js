const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer({dest: './uploads/avatars'});
const { Generic, Profile } = require('../middlewares/security');
const { body } = require('express-validator');
const { getProfilePage, updateUserInfo, deleteUser, uploadAvatar } = require('../controllers/profileController');

router.get('/', Generic.mustLogIn, getProfilePage);

router.post('/update',
  body('username')
    .matches(/^[a-zA-Z0-9_]{3,20}$/)
    .withMessage('Username must be 3–20 characters and only contain letters, numbers, and underscores'),

  Generic.mustLogIn,
  Profile.handleValidation,
  Profile.verifyProfileUpdate,
  updateUserInfo
);

router.post('/delete', Generic.mustLogIn, deleteUser);

router.post('/upload', Generic.mustLogIn, upload.single('avatar'), uploadAvatar);

router.use(Profile.handleErrors);

module.exports = router;