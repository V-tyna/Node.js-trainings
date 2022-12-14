const { Router } = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const { validationResult } = require('express-validator');

const { FIFTEEN_MINUTES_IN_MILLISECONDS, SG_API_KEY  } = require('../configs/index');
const registrationEmail = require('../emails/emailRegistrationSendler');
const resetEmail = require('../emails/emailResetSendler');
const User = require('../models_mongoose/user');
const { signinValidators, signupValidators } = require('../helpers/validators');

const authRouter = Router();
sgMail.setApiKey(SG_API_KEY);

authRouter.get('/accessRestoring/:token', async (req, res) => {
	if (!req.params.token) {
		return res.redirect('/auth/login#login');
	}

	try {
		const user = await User.findOne({
			resetToken: req.params.token,
			resetTokenExp: { $gt: Date.now() },
		});

		if (!user) {
			return res.redirect('/auth/login#login');
		} else {
			res.render('auth/restoreAccess', {
				title: 'Restore access page',
				accessError: req.flash('accessError'),
				userId: user._id.toString(),
				token: req.params.token,
			});
		}
	} catch (e) {
		console.log('Access restoring error: ', e);
	}
});

authRouter.get('/login', async (req, res) => {
	res.render('auth/login', {
		title: 'Auth page',
		isLogin: true,
		loginError: req.flash('loginError'),
		signupError: req.flash('signupError'),
	});
});

authRouter.get('/logout', async (req, res) => {
	req.session.destroy(() => {
		res.redirect('/auth/login#login');
	});
});

authRouter.get('/resetPassword', (req, res) => {
	res.render('auth/resetPassword', {
		title: 'Reset password page',
		resetError: req.flash('resetError'),
	});
});

authRouter.post('/accessRestoring', async (req, res) => {
	try {
		const { password, repeat_password, userId, token } = req.body;
		const user = await User.findOne({
			_id: userId,
			resetToken: token,
			resetTokenExp: { $gt: Date.now() },
		});

		if (password === repeat_password) {
			if (user) {
				user.password = await bcrypt.hash(password, 12);
				user.resetToken = undefined;
				user.resetTokenExp = undefined;
				await user.save();
				return res.redirect('/auth/login#login');
			} else {
				req.flash('accessError', 'There is no such user or access restoring time\'s up.');
				return res.redirect('/auth/login#login');
			}
		} else {
			req.flash('accessError', 'Passwords don\'t match.');
			return res.redirect('/auth/login#login');
		}
	} catch (e) {
		console.log('Setting new password error: ', e);
	}
});

authRouter.post('/resetPassword', (req, res) => {
	try {
		crypto.randomBytes(32, async (err, buffer) => {
			if (err) {
				req.flash(
					'resetPasswordError',
					'Something went wrong... Please, try again later.'
				);
				return res.redirect('auth/resetPassword');
			}

			const token = buffer.toString('hex');
			const candidate = await User.findOne({ email: req.body.email });

			if (candidate) {
				candidate.resetToken = token;
				candidate.resetTokenExp =
					Date.now() + FIFTEEN_MINUTES_IN_MILLISECONDS;
				await candidate.save();
				sgMail.send(resetEmail(candidate.email, token))
				.then((response) => {
					console.log(response[0].statusCode)
					console.log(response[0].headers)
				})
				.catch((error) => {
					console.error(error)
				})
				res.redirect('/auth/login#login');
			} else {
				req.flash('resetError', 'There is no such email.');
				return res.redirect('/auth/resetPassword');
			}
		});
	} catch (e) {
		console.log('Error during password reset: ', e);
	}
});

authRouter.post('/signin', signinValidators, async (req, res) => {
	try {
		const { email, password } = req.body;

		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			req.flash('loginError', errors.array()[0].msg);
			return res.status(422).redirect('/auth/login#login');
		}

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
					return res.redirect('/');
				});
			} else {
				req.flash('loginError', 'Wrong password.');
				return res.redirect('/auth/login#login');
			}
		} else {
			req.flash('loginError', "User with this email doesn't exist.");
			return res.redirect('/auth/login#login');
		}
	} catch (e) {
		console.log('User sign in error: ', e);
	}
});

authRouter.post('/signup', signupValidators, async (req, res) => {
	try {
		const { email, password, userName } = req.body;

		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			req.flash('signupError', errors.array()[0].msg);
			return res.status(422).redirect('/auth/login#signup');
		}

		const hashPassword = await bcrypt.hash(password, 12);
		const user = new User({
			email,
			password: hashPassword,
			name: userName,
			learningList: { stack: [] },
		});
		await user.save();
		res.redirect('/auth/login#login');
		sgMail
			.send(registrationEmail(email, userName))
			.then((response) => {
				console.log(response[0].statusCode);
				console.log(response[0].headers);
			})
			.catch((error) => {
				console.error(error);
			});
		
	} catch (error) {
		console.log('User sign un error: ', error);
	}
});

module.exports = authRouter;
