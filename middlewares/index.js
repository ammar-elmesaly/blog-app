const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');

// Security related

const helmet = require('helmet');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');

function middlewares(app) {

  // Pug template
  require('pug');
  app.engine('pug', require('pug').__express);

  app.set('view engine', 'pug');
  app.set('views', path.join(__dirname, '../views'));

  app.use(cookieParser());
  
  app.use('/public', express.static(path.join(__dirname, '../public')));
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

  app.use(bodyParser.urlencoded({extended: false}));
  app.use(helmet());

  app.disable("x-powered-by");  // Disable x-powered-by header for better security and saving bandwidth

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
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year
    }
  }));
}

module.exports = middlewares;