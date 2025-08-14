require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');

const PORT = process.env.PORT || 3000;

const loginRouter = require('./routers/login');
const logoutRouter = require('./routers/logout');
const signupRouter = require('./routers/signup');
const protectedRouter = require('./routers/protected');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

const User = require('./models/User');

// Pug template

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use(bodyParser.urlencoded({extended: false}));


// Session settings

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    expires: false
  }
}));

app.use((req, res, next) => {  // Middleware for getting logged-in status
  req.isLoggedIn = req.session.user ? true : false;
  next();
});

app.get('/', (req, res) => {
  res.render('pages/home.pug', {currentPage: 'home', logged: req.isLoggedIn});
});

app.get('/about', (req, res) => {
  res.render('pages/about.pug', {currentPage: 'about', logged: req.isLoggedIn});
});

app.get('/home', (req, res) => {
  res.redirect(301, '/');
});

app.use('/login', loginRouter);

app.use('/logout', logoutRouter);

app.use('/signup', signupRouter);

app.use('/protected', protectedRouter);

app.get('/{*any}', (req, res) => {  // This must be the last router. don't add any routers below it
  res.sendFile(path.join(__dirname, '../public/pages/404.html'));
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});