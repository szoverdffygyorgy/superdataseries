"use strict";

const mongoose = require("mongoose");
const Promise = require("promise");
const Algorithm = require("../data/models/algorithm");

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost:27017/users");

Algorithm.remove({
  name: "Trend Following";
}).exec().then((success) => {
  console.log("Removed Successfully! " + success);
}).catch((reason) => {
  console.log("Removal failed because: " + reason);
});
