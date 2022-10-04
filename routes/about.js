const { Router } = require('express');
const aboutRouter = Router();

aboutRouter.get('/', (req, res) => {
  res.render('about', {
		title: 'About page'
	});
})

module.exports = aboutRouter;