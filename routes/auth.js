const { Router } = require('express');
const authRouter = Router();
const bcrypt = require('bcryptjs');
const User = require('../models_mongoose/user');

authRouter.get('/login', async (req, res) => {
	res.render('auth/login', {
		title: 'Auth page',
		isLogin: true,
	});
});

authRouter.get('/logout', async (req, res) => {
	req.session.destroy(() => {});
	res.redirect('/auth/login#login');
});

authRouter.post('/signin', async (req, res) => {
	try {
		const { email, password } = req.body;
		const candidate = await User.findOne({ email });
		if (candidate) {
			const areSame = await bcrypt.compare(password, candidate.password);
			if (areSame) {
				const user = candidate;
				req.session.user = user;
				req.session.isAuthenticated = true;
				req.session.save((err) => {
					if (err) {
						throw new Error(err);
					}
					res.redirect('/');
				});
			} else {
				res.redirect('/auth/login#login');
			}
		} else {
			res.redirect('/auth/login#login');
		}
	} catch (e) {
		console.log('User sign in error: ', e);
	}
});

authRouter.post('/signup', async (req, res) => {
	try {
		const { email, password, repeated_password, name } = req.body;

		const candidate = await User.findOne({ email });
		if (candidate) {
			res.redirect('/auth/login#signup');
		} else {
			const hashPassword = await bcrypt.hash(password, 12);
			const user = new User({
				email,
				password: hashPassword,
				name,
				learningList: { stack: [] },
			});
			await user.save();
			res.redirect('/auth/login#login');
		}
	} catch (error) {
		console.log('User sign un error: ', error);
	}
});

module.exports = authRouter;
