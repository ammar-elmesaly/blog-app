const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    require: true
  },
  photoURL: String,
  likesAuthors: [mongoose.Schema.Types.ObjectId]
});

module.exports = mongoose.model('Post', postSchema);