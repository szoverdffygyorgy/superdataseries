"use strict";

const mongoose = require("mongoose");

module.exports = mongoose.model("DataPoint", {
  seriesName: String,
  timeStamp: Number,
  price: Number
});
