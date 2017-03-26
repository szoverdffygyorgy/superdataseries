"use strict";

const moment = require("moment");
const fs = require("fs");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/users");

const TimeSeries = mongoose.model("TimeSeries",
{
  name: String,
  dataPoints: Object
});

let timeSeriesName = "";
let series = {};

fs.readFile("../data/influxformat50.txt", {encoding: "utf-8"}, (err, lines) => {
  if(err) {
    throw new Error(err);
  } else {
    let data = lines.split("\n");
    for(let i = 0; i < data.length; i++) {
      if(data[i].length > 30) {
        timeSeriesName = data[i].substr(7,3) + data[i].substr(11,3);
        series[String(moment(data[i].substr(32, 20)).unix())] =
         data[i].substr(21, 10);
      }
    }

    new TimeSeries({name: timeSeriesName, dataPoints: series}).save((err) => {
      if(err) {
        throw new Error(err);
      } else {
        console.log("Serires insertion has been Successful!", series);
      }
    });
  }
});
