const { Router } = require('express');
const authGuard = require('../middlewares/authGuard');
const { addTechValidators } = require('../helpers/validators');
//const Tech = require('../models/techModel'); // NO DB
const Tech = require('../models_mongoose/tech');
const { validationResult } = require('express-validator');
const addRouter = Router();

addRouter.get('/', authGuard, (req, res) => {
	try {
		res.render('addTechnology', {
			title: 'Add page',
			isAdd: true
		});
	} catch(e) {
		console.log('Add tech render page error: ', e);
	}
});

addRouter.post('/', authGuard, addTechValidators, async (req, res) => {
	const { technologyName, duration, imageURL } = req.body;
	// const stack = new Tech(technologyName, duration, imageURL); // NO DB
	const stack = new Tech({
		techName: technologyName,
		duration: duration,
		image: imageURL,
		user_id: req.user
	});

	try {
		// await stack.saveAddedTech(); // NO DB

		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			req.flash('addTechError', errors.array()[0].msg);
			return res.status(422).render('addTechnology', {
				title: 'Add page',
				isAdd: true,
				formData: {
					technologyName: req.body.technologyName,
					duration: req.body.duration,
					imageURL: req.body.imageURL
				},
				addTechError: req.flash('addTechError')
			});
		} 

		await stack.save(); // Mongo DB
		return res.redirect('/stack');
	} catch(e) {
		console.log('Add technology failed with error', e);
	}
})

module.exports = addRouter;