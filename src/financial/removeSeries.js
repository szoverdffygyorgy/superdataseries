"use strict";

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/users");

const TimeSeries = mongoose.model("TimeSeries",
{
  name: String,
  dataPoints: Object
});

TimeSeries.remove({}, (err) => {
  if(err) {
    throw new Error(err);
  } else {
    console.log("Deleted series!");
  }
});
