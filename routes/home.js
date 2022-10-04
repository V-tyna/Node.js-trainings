const { Router } = require('express');
const MessagesService = require('../models/messagesModel');
const homeRouter = Router();

homeRouter.get('/', async (req, res) => {
	const messages = await MessagesService.getMessages();
  res.render('index', {
		title: 'Home page',
		messages
	});
});

homeRouter.post('/addMessage', async (req, res) => {
	const message = new MessagesService(req.body.message);
	await message.addMessage();
	res.redirect('/');
})

module.exports = homeRouter;
