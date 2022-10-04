const { Router } = require('express');
const Learning = require('../models/learningListModel');
const Tech = require('../models/techModel');

const learningRouter = Router();

learningRouter.get('/', async (req, res) => {
	const learningList = await Learning.getList();
  res.render('learningList', {
		title: 'Learning page',
		list: learningList
	});
});

learningRouter.post('/add', async (req, res) => {
  const tech = await Tech.getById(req.body.id);
  const techToLearn = new Learning(tech);
  await techToLearn.addTech();

  res.redirect('/learningList');
});

learningRouter.delete('/delete/:id', async (req, res) => {
  const tech = await Learning.deleteTech(req.params.id);
  res.status(200).json(tech);
})

module.exports = learningRouter;
