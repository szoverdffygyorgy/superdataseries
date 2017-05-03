"use strict";

const mongoose = require("mongoose");
const Promise = require("promise");
const Algorithm = require("../../data/models/algorithm");

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost:27017/users");

let meanReversion = new Algorithm({
  name: "Mean Reversion",
  host: "localhost",
  port: "5001",
  route: "runAlgorithm"
});

meanReversion.params = {
  user: "String",
  series: "String",
  window: "Number"
};

meanReversion.save().then((success) => {
  console.log("Algorithm added! " + success);
  mongoose.disconnect();
}).catch((reason) => {
  console.log("Insertion failed because: " + reason);
});
