const { body } = require('express-validator');
const User = require('../models_mongoose/user');

module.exports = {
	signupValidators: [
		body('email')
			.isEmail()
			.withMessage("Email is't valid.")
			.custom(async (value, { req }) => {
				try {
					const user = await User.findOne({ email: value });
					if (user) {
						return Promise.reject(
							'User with this email already exist.'
						);
					}
				} catch (e) {
					console.log('Async signup email validation error: ', e);
				}
			})
			.normalizeEmail(),
		body(
			'password',
			"Password can't be less that 6 symbols or more than 56."
		)
			.isLength({ min: 6, max: 56 })
			.isAlphanumeric()
			.trim(),
		body('repeat_password')
			.custom((value, { req }) => {
				if (value !== req.body.password) {
					throw new Error('Passwords should match');
				} else {
					return true;
				}
			})
			.trim(),
		body('userName', ' User name should be not less than 2 characters.')
			.isLength({ min: 2 })
			.isAlphanumeric()
			.trim(),
	],

	signinValidators: [
		body('email', 'Email is not valid').isEmail().normalizeEmail(),
		body(
			'password',
			"Password can't be less that 6 symbols or more than 56."
		)
			.isLength({ min: 6, max: 56 })
			.isAlphanumeric()
			.trim(),
	],

	addTechValidators: [body('imageURL', 'Enter valid url').isURL().trim()],
  editTechValidators: [body('image', 'Enter valid URL').isURL().trim()]
};
