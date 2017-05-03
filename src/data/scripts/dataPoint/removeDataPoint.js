"use strict";

const mongoose = require("mongoose");
const Promise = require("promise");
const DataPoint = require("../../models/dataPoint");

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost:27017/users");

DataPoint.remove({}).then((success) => {
  console.log("Successful removal! " + success);
  mongoose.disconnect();
}).catch((reason) => {
  throw new Error("Removal failed due to: " + reason);
});
