"use strict";

const mongoose = require("mongoose");

module.exports = mongoose.model("Trading History", {
  user: String,
  serires: String,
  price: Number,
  amountOfInstrument: Number,
  transactionType: String
});
