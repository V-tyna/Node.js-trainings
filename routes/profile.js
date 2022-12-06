const { Router } = require('express');

const authGuard = require('../middlewares/authGuard');
const User = require('../models_mongoose/user');

const profileRouter = Router();

profileRouter.get('/', authGuard, (req, res) => {
  res.render('profile', {
    title: 'User profile',
    isProfile: true,
    user: req.user.toObject()
  });
});

profileRouter.post('/', authGuard, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let isUpdated = false;
    const toChange = {};
    if (user.name !== req.body.name) {
      isUpdated = true;
      toChange.name = req.body.name;
    }
    if (req.file) {
      isUpdated = true;
      toChange.avatarURL = req.file.destination + '/' + req.file.filename;
    }
    if (isUpdated) {
      Object.assign(user, toChange);
      await user.save();
    }
    return res.redirect('/profile');
  } catch(e) {
    console.log('User profile error (updating profile or loading avatar error): ', e);
  }
});

module.exports = profileRouter;