 const { Router } = require('express');
 const authRouter = Router();
 const User = require('../models_mongoose/user');

authRouter.get('/login', async (req, res) => {
  res.render('auth/login', {
		title: 'Auth page',
		isLogin: true
	});
});

authRouter.get('/logout', async (req, res) => {
	req.session.destroy(() => {

	});
  res.redirect('/auth/login#login');
});

authRouter.post('/signin', async (req, res) => {
	try{
		const user = await User.findById('637faa2a6473d574288cb6aa');
		req.session.user = user;
		req.session.isAuthenticated = true;
		req.session.save(err => {
			if(err) {
				throw new Error(err);
			}
			res.redirect('/');
		})
	} catch(e) {
		console.log('User sign in error: ', e);
	}
});

module.exports = authRouter;