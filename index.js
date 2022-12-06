const express = require('express');
const csurf = require('csurf');
const flash = require('connect-flash');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const expressHandlebars = require('express-handlebars');

const aboutRouter = require('./routes/about');
const addRouters = require('./routes/add');
const authRouter = require('./routes/auth');
const errorPageHandler = require('./middlewares/errorPage');
const fileUploader = require('./middlewares/fileUploader');
const homeRouters = require('./routes/home');
const keys = require('./configs/index');
const learningRouter = require('./routes/learningList');
const makeUserSchema = require('./middlewares/makeUserSchema');
const profileRouter = require('./routes/profile');
const { SESSION_SECRET } = require('./configs/secure_keys');
const stackRouters = require('./routes/stack');
// const User = require('./models_mongoose/user'); // WITHOUT SESSIONS and AUTH
const varMiddleware = require('./middlewares/variables');

const PORT = process.env.PORT || keys.DEFAULT_PORT;

const app = express();

const handlebars = expressHandlebars.create({
	defaultLayout: 'main',
	extname: '.hbs',
	helpers: require('./helpers/hbs-helpers')
});

const store = new MongoStore({
	collection: 'sessions',
	uri: keys.MONGO_URL
});

app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');
app.set('views', 'views'); // folder where all templates will be saved

app.use(express.static(path.join(__dirname, 'public')));
app.use('/avatars', express.static(path.join(__dirname, 'avatars')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
	secret: SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	store
}));

app.use(fileUploader.single('avatar'));

app.use(csurf());
app.use(flash());

app.use(makeUserSchema);
app.use(varMiddleware);

app.use('/about', aboutRouter);
app.use('/add', addRouters);
app.use('/auth', authRouter);
app.use('/', homeRouters);
app.use('/learningList', learningRouter);
app.use('/profile', profileRouter);
app.use('/stack', stackRouters);

app.use(errorPageHandler);

app.get('/api/users', (req, res) => {
	res.sendFile(path.join(__dirname, 'assets/users.json'));
});

async function start() {
	try {
		await mongoose.connect(keys.MONGO_URL, {useNewUrlParser: true});

		app.listen(PORT, () => {
			console.log(`Server is running on port: ${PORT}`);
	});
	} catch(error) {
		console.log('Server connection error: ', error);
	}
	
}

start();
