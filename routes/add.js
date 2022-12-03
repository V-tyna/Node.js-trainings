const { Router } = require('express');
const authGuard = require('../middlewares/authGuard');
//const Tech = require('../models/techModel'); // NO DB
const Tech = require('../models_mongoose/tech');
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

addRouter.post('/', authGuard, async (req, res) => {
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
		await stack.save(); // Mongo DB
		res.redirect('/stack');
	} catch(e) {
		console.log('Add technology failed with error', e);
	}
})

module.exports = addRouter;