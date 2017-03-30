"use strict";

const mongoose = require("mongoose");
const Promise = require("promise");

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost:27017/users");

const DataPoint = mongoose.model("DataPoint",
{
  seriesName: String,
  timeStamp: Number,
  price: Number
});

DataPoint.remove({}).then((success) => {
  console.log("Successful removal! " + success);
}).catch((reason) => {
  throw new Error("Removal failed due to: " + reason);
});
