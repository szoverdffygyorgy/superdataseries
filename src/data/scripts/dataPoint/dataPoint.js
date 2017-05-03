"use strict";

const moment = require("moment");
const fs = require("fs");
const mongoose = require("mongoose");
const Promise = require("promise");
const DataPoint = require("../../models/dataPoint");

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost:27017/users");

let readFile = Promise.denodeify(fs.readFile);

console.log(process.argv[2]);
let fileName = process.argv[2];

readFile("../../historicalData/" + fileName + ".csv", {
  encoding: "utf-8"
}).then((rawData) => {
  let data = rawData.split("\n");
  let time;
  let price;

  for(let i = 1; i < data.length - 1; i++) {
    time = parseInt(moment(data[i].substr(0, 19)).unix());
    price = data[i].substr(20, 10);

    console.log(fileName, time, price);

    new DataPoint({
      "seriesName": fileName,
      "timeStamp": time,
      "price": price
    }).save().then((success) => {
      console.log("Insertion Successful: " + success);

      DataPoint.find().count().exec().then((count) => {
        if(count === data.length - 1) {
          mongoose.disconnect();
        }
      }).catch((reason) => {
        throw new Error("Error in querying the number of elements in collection " + reason);
      });
    }).catch((reason) => {
      throw new Error("Error during insertion: " + reason);
    });
  }

}).catch((reason) => {
  throw new Error(reason);
});
