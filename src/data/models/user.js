"use strict";

const mongoose = require("mongoose");

module.exports = mongoose.model("User", {
  name: String,
  userName: String,
  password: String,
  profileUrl: String,
  balance: Number,
  portfolio: Object
});
