"use strict";

const mongoose = require("mongoose");
const Promise = require("promise");
const tradingHistory = require("../../models/tradingHistory");

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost:27017/users");

tradingHistory.remove({}).then((success) => {
  console.log("Transaction history removed successfully! " + success);
  mongoose.disconnect();
}).catch((reason) => {
  console.log("Transaction history removal failed because: " + reason);
});
