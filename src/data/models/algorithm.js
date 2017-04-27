"use strict";

const mongoose = require("mongoose");

module.exports = mongoose.model("Algorithm", {
  name: String,
  host: String,
  route: String,
  params: Object
});
