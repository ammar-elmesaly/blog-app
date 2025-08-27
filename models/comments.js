const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  likesAuthors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
});

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  likesAuthors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  replies: [replySchema]
});

module.exports = mongoose.model("Comment", commentSchema);