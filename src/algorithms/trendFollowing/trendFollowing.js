"use strict";

const mongoose = require("mongoose");
const Promise = require("promise");
const Algorithm = require("../../data/models/algorithm");

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost:27017/users");

let trendFollowing = new Algorithm({
  name: "Trend Following",
  host: "localhost",
  port: "5000",
  route: "runAlgorithm",
});

trendFollowing.params = {
  user: "String",
  series: "String",
  window1: "Number",
  window2: "Number"
};

trendFollowing.save().then((success) => {
  console.log("Algorithm added! " + success);
  mongoose.disconnect();
}).catch((reason) => {
  console.log("Insertion failed because: " + reason);
});
