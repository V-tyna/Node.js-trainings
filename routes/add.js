const { Router } = require('express');
const Tech = require('../models/techModel');
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
	const stack = new Tech(technologyName, duration, imageURL);
	await stack.saveAddedTech();
	res.redirect('/stack');
})

module.exports = addRouter;