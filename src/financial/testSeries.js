"use strict";

const moment = require("moment");
const fs = require("fs");
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

let readFile = Promise.denodeify(fs.readFile);

readFile("../data/influxformat50.txt", {encoding: "utf-8"}).then((rawData) => {
  let data = rawData.split("\n");
  let timeSeriesName;
  let time;
  let price;

  for(let i = 0; i < data.length; i++) {
    if(data[i].length > 30) {
      timeSeriesName = data[i].substr(7,3) + data[i].substr(11,3);
      time = parseInt(moment(data[i].substr(32, 20)).unix());
      price = data[i].substr(21, 10);

      console.log(timeSeriesName, time, price);

      new DataPoint({
        "seriesName": timeSeriesName,
        "timeStamp": time,
        "price": price
      }).save().then((success) => {
        console.log("Insertion Successful: " + success);
      }).catch((reason) => {
        throw new Error("Error during insertion: " + reason);
      });
    }
  }

}).catch((reason) => {
  throw new Error(reason);
});
