require('dotenv').config();
const express = require('express');
const app = express();

const https = require('https');
const fs = require('fs');

const allRouters = require('./routes');

const PORT = process.env.PORT || 3000;

const mongoose = require('mongoose');
const { mustNotLogIn } = require('./middlewares/security.js');

mongoose.connect(process.env.MONGO_URI);

require('./middlewares/index.js')(app);  // run middlwares

app.get('/home', (req, res) => {
  res.redirect(301, '/');
});

app.use(allRouters);

app.use((err, req, res, next) => {  // Server Global Error handler
  res.status(500).send(err);
});

app.get('/{*any}', (req, res) => {  // This must be the last router. don't add any routers below it
  res.render('pages/404.pug');
});

/*
http listener
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
*/


// Set https

const httpsOptions = {
  key: fs.readFileSync('./certs/server.key'),
  cert: fs.readFileSync('./certs/server.cert')
};

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`HTTPS Server running on port ${PORT}`);
});