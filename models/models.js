const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const snippetSchema = new mongoose.Schema({
  snippetBody: String,
  shortUrl: String,
  clickCount: Number,
  key: String,
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
const User = mongoose.model("User", UserSchema);
const Snippet = mongoose.model("Snippets", snippetSchema);

module.exports = { User, Snippet };
