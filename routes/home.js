const { Router } = require('express');
const authGuard = require('../middlewares/authGuard');
const deepClone = require('../helpers/deepClone');
const mapMessages = require('../helpers/mapMessages');
// const MessagesService = require('../models/messagesModel'); // NO DB
const Message = require('../models_mongoose/message');
const homeRouter = Router();

homeRouter.get('/', async (req, res) => {
	try {
		// const messages = await MessagesService.getMessages(); // NO DB
		const allMessages = deepClone(await Message.find().populate('user'));
		const messages = mapMessages(allMessages);
		const currentMessageId = req.query.message_id;
	
		res.render('index', {
			title: 'Home page',
			currentMessage: req.query ? messages.find(m => m.message_id === currentMessageId) : null,
			userId: req.user ? req.user._id.toString() : null, // @root
			editMode: req.query.edit,
			deleteMode: req.query.delete,
			messages
		});
	} catch(e) {
		console.log('Rendering message (home) page error: ', e);
	}
});

homeRouter.post('/addMessage', authGuard, async (req, res) => {
	try {
		//const message = new MessagesService(req.body.message); // NO DB
		//await message.addMessage(); // NO DB
		const message = new Message({
			user: req.user,
			content: req.body.message,
			date: new Date().toLocaleString()
		});
		await message.save();
		res.redirect('/');
	} catch(e) {
		console.log('Message adding error: ', e);
	}
});

homeRouter.get('/:id/edit', authGuard, (req, res) => {
	try {
		return res.redirect(`/?message_id=${req.params.id}&edit=true`);
	} catch(e) {
		console.log('Message adding error: ', e);
	}
});

homeRouter.get('/:id/delete', authGuard, (req, res) => {
	try {
		return res.redirect(`/?message_id=${req.params.id}&delete=true`);
	} catch(e) {
		console.log('Message delete error: ', e);
	}
});

homeRouter.post('/:id/edit', authGuard, async (req, res) => {
	try {
			const message = await Message.findById(req.params.id);
			const updatedMessage = Object.assign(message, { content: req.body.message_content });
			await updatedMessage.save();
			return res.redirect('/');
	} catch(e) {
		console.log('Message editing error: ', e);
	}
});

homeRouter.post('/:id/delete', authGuard, async (req, res) => {
	try {
		await Message.findByIdAndDelete(req.params.id);
		return res.redirect('/');
	} catch(e) {
		console.log('Message deletion error: ', e);
	}
});

module.exports = homeRouter;
