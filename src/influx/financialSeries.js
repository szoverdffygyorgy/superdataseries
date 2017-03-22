"use strict";

const Influx = require("influx");
const fs = require("fs");
const moment = require("moment");

let lineReader = require("readline").createInterface({
  input: fs.createReadStream("../data/influxformat50.txt")
});

/*lineReader.on("line", (line) => {
  if(line.length > 29) {
    console.log("measurement: " + line.substr(7,7) + " fields: [" +
     line.substr(15,6) + line.substr(21,10) + " time: " + line.substr(32,20) +
      "]");
  }
});*/

let influx = new Influx.InfluxDB("http://localhost:8086");

influx.createDatabase("timeSeriesTest").then(() => {
  console.log("Database successfully created");
}).catch((reason) => {
  console.log("Database creation failed due to: " + reason);
});

influx = new Influx.InfluxDB({
  host: "localhost:8086",
  database: "timeSeriesTest",
  schema: [
    {
      measurement: "HUFUSD",
      fields: {
        price: Influx.FieldType.FLOAT,
        time: Influx.FieldType.STRING
      },
      tags: []
    }
  ]
});

lineReader.on("line", (line) => {
  if(line.length > 29) {
    let time = moment(line.substr(32,20)).unix() + "000";
    console.log(time);
    influx.writePoints([
      {
        measurement: line.substr(7,3) + line.substr(11,3),
        tags: {},
        fields: {
          price: line.substr(21,10),
          time: time
        }
      }
    ],
  {
    database: "timeSeriesTest",
    retentionPolicy: "autogen",
    precision: "RFC3339"
  }).then(() => {
    console.log("Successful insert!");
  }).catch((reason) => {
    console.log("Insert was not Successful due: " + reason);
  })}
});
