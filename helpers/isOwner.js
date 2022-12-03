module.exports = function(techUserId, req) {
  return techUserId.toString() === req.user._id.toString();
}