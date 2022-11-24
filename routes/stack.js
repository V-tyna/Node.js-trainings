const { Router } = require('express');
// const Tech = require('../models/techModel'); // NO DB
const Tech = require('../models_mongoose/tech');
const stackRouter = Router();
const deepClone = require('../helpers/deepClone');

stackRouter.get('/', async (req, res) => {
	// const stack = await Tech.getAll();
	const stack = deepClone(await Tech.find());
  res.render('stack', {
		title: 'Stack page',
		isStack: stack
	});
});

stackRouter.get('/:id/edit', async (req, res) => {
	if (!req.query.allow) {
		return res.redirect('/');
	}
	//const tech = await Tech.getById(req.params.id); //NO DB
	const tech = deepClone(await Tech.findById(req.params.id));
	res.render('editTechnology', {
		title: `Edit ${tech.techName}`,
		tech: tech
	})
});

stackRouter.post('/edit', async (req, res) => {
	// await Tech.update(req.body); // NO DB
	const { id } = req.body;
	delete req.body.id;
	deepClone(await Tech.findByIdAndUpdate(id, req.body));
	res.redirect('/stack');
});

stackRouter.post('/remove', async (req, res) => {
	try {
		await Tech.findByIdAndDelete(req.body.tech_id);
		res.redirect('/stack');
	} catch(e) {
		console.log('Error during the deletion: ', e);
	}
});

stackRouter.get('/:id', async (req, res) => {
	// const tech = await Tech.getById(req.params.id); // NO DB
	const tech = deepClone(await Tech.findById(req.params.id));
	res.render('technology', {
		layout: 'empty',
		title: `Technology ${tech.techName}`,
		tech: tech
	});
});


module.exports = stackRouter;