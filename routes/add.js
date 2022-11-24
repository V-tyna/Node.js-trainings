const { Router } = require('express');
//const Tech = require('../models/techModel'); // NO DB
const Tech = require('../models_mongoose/tech');
const addRouter = Router();

addRouter.get('/', (req, res) => {
  res.render('addTechnology', {
		title: 'Add page',
		iaAdd: true
	});
})

addRouter.post('/', async (req, res) => {
	console.log(req.body);
	const { technologyName, duration, imageURL } = req.body;
	// const stack = new Tech(technologyName, duration, imageURL); // NO DB
	const stack = new Tech({
		techName: technologyName,
		duration: duration,
		image: imageURL
	});

	try {
		// await stack.saveAddedTech(); // NO DB
		await stack.save();
		res.redirect('/stack');
	} catch(e) {
		console.log('Add technology failed with error', e);
	}
})

module.exports = addRouter;