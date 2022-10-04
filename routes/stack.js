const { Router } = require('express');
const Tech = require('../models/techModel');
const stackRouter = Router();

stackRouter.get('/', async (req, res) => {
	const stack = await Tech.getAll();
  res.render('stack', {
		title: 'Stack page',
		isStack: stack
	});
});

stackRouter.get('/:id/edit', async (req, res) => {
	if (!req.query.allow) {
		return res.redirect('/');
	}
	const tech = await Tech.getById(req.params.id);
	res.render('editTechnology', {
		title: `Edit ${tech.techName}`,
		tech: tech
	})
});

stackRouter.post('/edit', async (req, res) => {
	await Tech.update(req.body);
	res.redirect('/stack');
})

stackRouter.get('/:id', async (req, res) => {
	const tech = await Tech.getById(req.params.id);
	res.render('technology', {
		layout: 'empty',
		title: `Technology ${tech.techName}`,
		tech: tech
	});
});

module.exports = stackRouter;