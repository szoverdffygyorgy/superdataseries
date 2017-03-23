"use strict";

const Influx = require("influx");
const fs = require("fs");
const moment = require("moment");
const readLine = require("readline");

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

  let lineReader = readLine.createInterface({
    input: fs.createReadStream("../data/influxformat50.txt")
  });

  lineReader.on("line", (line) => {
    let time;
    if(line.length > 29) {
      time = moment(line.substr(32, 20)).unix();
      console.log(time);

      influx.writePoints([
        {
          measurement: line.substr(7,3) + line.substr(11,3),
          tags: {},
          fields: {
            "price": line.substr(21, 10),
            "time": time
          }
        }
      ], {
        database: "timeSeriesTest",
        retentionPolicy: "autogen",
        precision: "s"
      }).then(() => {
        console.log("Successful insertion!");
      }).catch((reason) => {
        console.log("Insertion failed due to: " + reason);
      });
      /*dataPoints.push({
        measurement: line.substr(7,3) + line.substr(11,3),
        tags: {},
        fields: {
          "price": line.substr(21, 10),
          "time": time
        }
      });*/
    }
  });
}).catch((reason) => {
  console.log("Database creation failed due to: " + reason);
});
