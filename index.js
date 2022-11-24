const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const aboutRouter = require('./routes/about');
const addRouters = require('./routes/add');
const homeRouters = require('./routes/home');
const stackRouters = require('./routes/stack');
const learningRouter = require('./routes/learningList');
const User = require('./models_mongoose/user');

const PORT = process.env.PORT || 4200;

const app = express();

const handlebars = expressHandlebars.create({
	defaultLayout: 'main',
	extname: '.hbs'
});

app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');
app.set('views', 'views'); // folder where all templates will be saved

app.use(async (req, res, next) => {
	try{
		const user = await User.findById('637faa2a6473d574288cb6aa');
		req.user = user;
		next();
	} catch(e) {
		console.log('User from data base error: ', e);
	}
})

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/about', aboutRouter);
app.use('/add', addRouters);
app.use('/', homeRouters);
app.use('/learningList', learningRouter);
app.use('/stack', stackRouters);

app.get('/api/users', (req, res) => {
	res.sendFile(path.join(__dirname, 'assets/users.json'));
});

async function start() {
	try {
		const MONGO_URL = 'mongodb+srv://V-tyna:zW7AqceTaXfbW3QF@cluster0.ipywaxp.mongodb.net/?retryWrites=true&w=majority';
		await mongoose.connect(MONGO_URL, {useNewUrlParser: true});

		const candidate = await User.findOne();
		if (!candidate) {
			const user = new User({
				email: 'v-tyna@gmail.com',
				name: 'Valya',
				learningList: { stack: [] }
			});
			await user.save();
		}
		app.listen(PORT, () => {
			console.log(`Server is running on port: ${PORT}`);
	});
	} catch(error) {
		console.log('Server connection error: ', error);
	}
	
}

start();
