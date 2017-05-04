"use strict";

const mongoose = require("mongoose");
const Promise = require("promise");
const moment = require("moment");
const TradingHistory = require("../../models/tradingHistory");

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost:27017/users");

for(let idx = 0; idx < 10; idx += 1) {
  new TradingHistory({
    user: "user" + idx,
    series: "aRandomSerires",
    price: 420.00,
    amountOfInstrument: 10,
    time: moment(),
    transactionType: Math.random() < 0.5 ? "buy" : "sell"
  }).save().then((success) => {
    console.log("Transaction inserted into history: " + success);

    TradingHistory.find().count().exec().then((count) => {
      if(count === 10) {
        mongoose.disconnect();
      }
    }).catch((reason) => {
      throw new Error("Error in querying the number of elements in collection " + reason);
    });
  }).catch((reason) => {
    throw new Error("Transaction insert failed because: " + reason);
  });
}
