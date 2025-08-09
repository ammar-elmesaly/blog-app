require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use('/public', express.static(path.join(__dirname, '../Frontend/Static')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend/Static/Pages/home.html'));
});

app.get('/about', (req, res) => {
  res.send({
    message: "Hi from about"
  });
});

app.get('/login', (req, res) => {
  res.send({
    message: "Hi from login"
  });
});

app.get('/home', (req, res) => {
  res.redirect(301, '/');
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
