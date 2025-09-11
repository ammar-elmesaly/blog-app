const express = require('express');
const router = express.Router();

const { Generic, Profile } = require('../middlewares/security');
const { body } = require('express-validator');
const { getProfilePage, updateUserInfo, changePassword, deleteUser, uploadAvatar } = require('../controllers/profileController');

const multer = require('multer');
let upload;
if (process.env.NODE_ENV === "PROD") {
  upload = multer({dest: '/tmp'});
} else {
  upload = multer({dest: './uploads/posts'});
}

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

router.post('/change-password',
  body('old_password')
    .matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/)
    .withMessage('Password must be at least 8 characters, contain one uppercase letter and one number'),

  Generic.mustLogIn,
  Profile.handleValidation,
  Profile.validatePasswordChange,
  changePassword
);

router.post('/delete', Generic.mustLogIn, deleteUser);

router.post('/upload', Generic.mustLogIn, upload.single('avatar'), uploadAvatar);

router.use(Profile.handleErrors);

module.exports = router;