const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const expressHandlebars = require('express-handlebars');
const aboutRouter = require('./routes/about');
const addRouters = require('./routes/add');
const authRouter = require('./routes/auth');
const homeRouters = require('./routes/home');
const stackRouters = require('./routes/stack');
const learningRouter = require('./routes/learningList');
// const User = require('./models_mongoose/user'); // WITHOUT SESSIONS and AUTH
const varMiddleware = require('./middlewares/variables');

const PORT = process.env.PORT || 4200;
const MONGO_URL = 'mongodb+srv://V-tyna:zW7AqceTaXfbW3QF@cluster0.ipywaxp.mongodb.net/?retryWrites=true&w=majority';

const app = express();

const handlebars = expressHandlebars.create({
	defaultLayout: 'main',
	extname: '.hbs'
});

const store = new MongoStore({
	collection: 'sessions',
	uri: MONGO_URL
});

app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');
app.set('views', 'views'); // folder where all templates will be saved

// app.use(async (req, res, next) => {
// 	try{
// 		const user = await User.findById('637faa2a6473d574288cb6aa');
// 		req.user = user;
// 		next();
// 	} catch(e) {
// 		console.log('User from data base error: ', e);
// 	}
// }); // WITHOUT SESSIONS and AUTH

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
	secret: 'some secret token',
	resave: false,
	saveUninitialized: false,
	store
}));
app.use(varMiddleware);

app.use('/about', aboutRouter);
app.use('/add', addRouters);
app.use('/auth', authRouter);
app.use('/', homeRouters);
app.use('/learningList', learningRouter);
app.use('/stack', stackRouters);

app.get('/api/users', (req, res) => {
	res.sendFile(path.join(__dirname, 'assets/users.json'));
});

async function start() {
	try {
		await mongoose.connect(MONGO_URL, {useNewUrlParser: true});

		// const candidate = await User.findOne();
		// if (!candidate) {
		// 	const user = new User({
		// 		email: 'v-tyna@gmail.com',
		// 		name: 'Valya',
		// 		learningList: { stack: [] }
		// 	});
		// 	await user.save();
		// } // WITHOUT SESSIONS and AUTH

		app.listen(PORT, () => {
			console.log(`Server is running on port: ${PORT}`);
	});
	} catch(error) {
		console.log('Server connection error: ', error);
	}
	
}

start();
