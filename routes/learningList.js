const { Router } = require('express');
// const Learning = require('../models/learningListModel'); // NO DB
// const Tech = require('../models/techModel'); // NO DB
const Tech = require('../models_mongoose/tech');
const mapLearningListStack = require('../helpers/mapLearningListStack');

const learningRouter = Router();

learningRouter.get('/', async (req, res) => {
	// const learningList = await Learning.getList(); // NO DB
  const user = await req.user.populate('learningList.stack.tech_id');
  const learningList = mapLearningListStack(user.learningList);

  res.render('learningList', {
		title: 'Learning page',
		list: learningList
	});
});

learningRouter.post('/add', async (req, res) => {
  const tech = await Tech.findById(req.body.id);
  req.user.addToLearningList(tech);
  // const tech = await Tech.getById(req.body.id); // NO DB
  // const techToLearn = new Learning(tech); // NO DB
  // await techToLearn.addTech(); // NO DB

  res.redirect('/learningList');
});

learningRouter.delete('/delete/:id', async (req, res) => {
  // const tech = await Learning.deleteTech(req.params.id); // NO DB
  await req.user.removeFromLearningList(req.params.id);
  const user = await req.user.populate('learningList.stack.tech_id');
  const learningList = mapLearningListStack(user.learningList);
  res.status(200).json(learningList);
})

module.exports = learningRouter;
