"use strict";

const mongoose = require("mongoose");
const Promise = require("promise");
const tradingHistory = require("../../models/tradingHistory");

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost:27017/users");

for(let idx = 0; idx < 10; idx += 1) {
  new tradingHistory({
    user: "user" + idx,
    series: "testSerires",
    price: 420.00,
    amountOfInstrument: 10,
    transactionType: Math.random() < 0.5 ? "buy" : "sell"
  }).save().then((success) => {
    console.log("Transaction inserted into history: " + success);
  }).catch((reason) => {
    console.log("Transaction insert failed because: " + reason);
  });
}
