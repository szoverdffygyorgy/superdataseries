"use strict";

const fs = require("fs");
const moment = require("moment");

let lineReader = require("readline").createInterface({
  input: fs.createReadStream("../data/influxformat50.txt")
});

lineReader.on("line", (line) => {
  let newLine;
  if(line.length > 29) {
    newLine = line.substr(7,3) + line.substr(11,3) + "," + line.substr(15,16) +
     " A_random_value=8 " + moment(line.substr(32,20)).unix() + "\r\n";
  } else {
    newLine = line + "\r\n";
  }

  fs.appendFile("influxFormat50.txt", newLine, (err) => {
    if(err) {
      throw new Error(err);
    }
  });
});
