const { Router } = require('express');
const { validationResult } = require('express-validator');

const { editTechValidators } = require('../helpers/validators');
const authGuard = require('../middlewares/authGuard');
const deepClone = require('../helpers/deepClone');
const isOwner = require('../helpers/isOwner');
// const Tech = require('../models/techModel'); // NO DB
const Tech = require('../models_mongoose/tech');
const stackRouter = Router();

stackRouter.get('/', async (req, res) => {
	// const stack = await Tech.getAll(); //NO DB
	try {
		const stack = deepClone(await Tech.find());
  	res.render('stack', {
			title: 'Stack page',
			isStack: stack,
			userId: req.user ? req.user._id.toString() : null // @root
		});
	} catch(e) {
		console.log('Stack page rendering (GET Request) error: ', e);
	}
});

stackRouter.get('/:id/edit', authGuard, async (req, res) => {
	if (!req.query.allow) {
		return res.redirect('/');
	}

	try {
		//const tech = await Tech.getById(req.params.id); //NO DB
		
		const tech = deepClone(await Tech.findById(req.params.id));

		if (!isOwner(tech.user_id, req)) {
			return res.redirect('/stack');
		} else {
			res.render('editTechnology', {
				title: `Edit ${tech.techName}`,
				tech: tech,
				editTechError: req.flash('editTechError')
			});	
		}
		
	} catch(e) {
		console.log('Editing page error: ', e);
	}
});

stackRouter.post('/edit', authGuard, editTechValidators, async (req, res) => {
	// await Tech.update(req.body); // NO DB
	try {
		const { id, user_id, techName, duration, image } = req.body;
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			req.flash('editTechError', errors.array()[0].msg);
			return res.status(422).redirect(`/stack/${id}/edit?allow=true`);
		} 

		if (!isOwner(user_id, req)) {
			return res.redirect('/stack');
		} else {
			delete req.body.id;
			deepClone(await Tech.findByIdAndUpdate(id, req.body));
			res.redirect('/stack');
		}
	} catch(e) {
		console.log('Edit POST request error: ', e);
	}

});

stackRouter.post('/remove', authGuard, async (req, res) => {
	try {
		await Tech.findByIdAndDelete({
			_id: req.body.tech_id,
			user_id: req.user._id
		});
		res.redirect('/stack');
	} catch(e) {
		console.log('Error during the tech deletion: ', e);
	}
});

stackRouter.get('/:id', async (req, res) => {
	// const tech = await Tech.getById(req.params.id); // NO DB
	try {
		const tech = deepClone(await Tech.findById(req.params.id));
		res.render('technology', {
			layout: 'empty',
			title: `Technology ${tech.techName}`,
			tech: tech
		});
	} catch(e) {
		console.log('Open tech error: ', e);
	}
});

module.exports = stackRouter;
