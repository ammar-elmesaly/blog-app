require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;

const loginRouter = require('./routers/login');
const signupRouter = require('./routers/signup');

// const mongoose = require('mongoose');

// mongoose.connect(process.env.MONGO_URI);

/* Pug template */

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
  res.render('pages/home.pug', {currentPage: 'home'});
});

app.get('/about', (req, res) => {
  res.render('pages/about.pug', {currentPage: 'about'});
});

app.get('/home', (req, res) => {
  res.redirect(301, '/');
});

app.use('/login', loginRouter);

app.use('/signup', signupRouter);

app.get('/{*any}', (req, res) => {  // This must be the last router. don't add any routers below it
  res.sendFile(path.join(__dirname, '../public/pages/404.html'));
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
