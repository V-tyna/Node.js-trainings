const User = require('../models_mongoose/user');

module.exports = async function(req, res, next) {
  if (!req.session.user) {
    return next();
  }

  req.user = await User.findById(req.session.user._id);
  next();
}
