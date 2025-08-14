require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

// Security related

const helmet = require('helmet');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const https = require('https');
const fs = require('fs');

const allRouters = require('./routes');

const PORT = process.env.PORT || 3000;

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

const User = require('./models/users');

// Pug template

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, './public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(helmet());

app.disable("x-powered-by");  // Disable x-powered-by header for better security and saving bandwidth

// Set https

const httpsOptions = {
  key: fs.readFileSync('./certs/server.key'),
  cert: fs.readFileSync('./certs/server.cert')
};

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
    secure: true,
    expires: false,
    httpOnly: true
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

app.use(allRouters);

app.get('/{*any}', (req, res) => {  // This must be the last router. don't add any routers below it
  res.render('pages/404.pug');
});


/*
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
*/

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`HTTPS Server running on port ${PORT}`);
});