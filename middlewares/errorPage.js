module.exports = function(req, res, next) {
  return res.status(404).render('404', {
    title: 'Page is not found.'
  });
}