"use strict";

const mongoose = require("mongoose");

module.exports = mongoose.model("Trading History", {
  user: String,
  series: String,
  price: Number,
  timeStamp: String,
  amountOfInstrument: Number,
  transactionType: String
});
