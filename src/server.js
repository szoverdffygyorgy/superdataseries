"use strict";

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = require("express")();
const Influx = require("influx");
const http = require("http");
const moment = require("moment");
const Promise = require("promise");
const helper = require("./helper.js")({promise: Promise, app: app});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost:27017/users");

const User = mongoose.model("User",
{
  name: String,
  userName: String,
  password: String,
  profileUrl: String,
  balance: Number,
  portfolio: Object
});

 const DataPoint = mongoose.model("DataPoint",
 {
   seriesName: String,
   timeStamp: Number,
   price: Number
 });

app.post("/loginrequest", (req, res) => {
  let userName = req.body.user;
  let password = req.body.pass;

  User.findOne({"userName": userName, "password": password}).exec()
  .then((user) => {
    console.log(user);
    let response = {
      userName: user.userName,
      name: user.name,
      profileUrl: user.profileUrl,
      balance: user.balance
    };

    res.send(JSON.stringify(response));
  }).catch((reason) => {
    throw new Error("Login failed due to: " + reason);
  });
});

app.post("/transaction", (req, res) => {
  let userName = req.body.user;
  let transactionType = req.body.transactionType;
  let transactionValue = parseInt(req.body.transactionValue);

  User.findOne({"userName": userName}).exec()
  .then((user) => {
    if(transactionType === "buy") {
      user.balance -= transactionValue;
    } else if(transactionType === "sell") {
      user.balance += transactionValue;
    } else {
      throw new Error("Invalid transactionType:" + transactionType);
    }

    user.save().then((success) => {
      console.log("Updated user: " + success);
    }).catch((reason) => {
      throw new Error("Update failed: " + reason);
    });

    res.send(JSON.stringify(user.balance));
  }).catch((reason) => {
    throw new Error("Transaction failed: " + reason);
  });
});

app.get("/series", (req, res) => {
  DataPoint.find({}).exec()
  .then((series) => {
    res.send(JSON.stringify(series));
  }).catch((reason) => {
    throw new Error("No TimeSeries found: " + reason);
  });
});

app.post("/seriesQuery", (req, res) => {
  let from = parseInt(req.body.from) - 1 || -1;
  let to = parseInt(req.body.to) + 1 || parseInt(moment().unix()) + 1;
  let seriesName = req.body.series;

  DataPoint.find({"seriesName": seriesName, "timeStamp": {$gt: from, $lt: to}})
  .exec().then((dataPoints) => {
    console.log(dataPoints);
    res.send(JSON.stringify(dataPoints));
  }).catch((reason) => {
    throw new Error("TimeSeries data not found: " + reason);
  });
});

//app.use(express.static("examples/index.html"));

helper.setRoute("/", "../examples/index.html");
helper.setRoute("/chart_data/test_data", "./data/csv_test.csv");
helper.setRoute("/chart_data/forex_data_test", "./data/test_data.csv");
helper.setRoute("/libs/knob.js", "../node_modules/knob-js/dist/knob.js");
helper.setRoute("/libs/knob.min.css", "../node_modules/knob-js/dist/knob.min.css");
helper.setRoute("/built/superdataseries.js", "../dist/superdataseries.js");
helper.setRoute("/built/main.built.js", "../examples/main.built.js");
helper.setRoute("/chart_data/formatted50", "./data/format50.csv");
helper.setRoute("/chart_data/formatted100", "./data/format100.csv");
helper.setRoute("/chart_data/formatted500", "./data/format500.csv");

app.listen(8888, () => {
	console.log("Host Server is running on port 8888");
});

// app.get("/influx_test", (req, res) => {
//   http.get("http://localhost:8086/query?chunked=true&db=test&epoch=ns&q=SELECT+%2A+FROM+treasures",
//     (response) => {
//       response.setEncoding("utf-8");
//       let rawData = "";
//
//       response.on("data", (chunk) => {
//         rawData += chunk;
//       });
//
//       response.on("end", () => {
//         let parsedData = JSON.parse(rawData);
//         console.log(parsedData);
//         res.send(parsedData);
//       });
//     })
// });
//
// const influx = new Influx.InfluxDB({
//   host: 'localhost:8086',
//   database: 'pirates',
//   schema: [
//     {
//       measurement: 'treasures',
//       fields: {
//         captain_id: Influx.FieldType.STRING,
//         value: Influx.FieldType.INTEGER
//       },
//       tags: []
//     }
//   ]
// });
//
// app.get("/influx_node_test", (req, res) => {
//   /*"SELECT * FROM test.autogen.treasures "*/
//   influx.query("SELECT time, price FROM timeSeriesTest.autogen.HUFUSD")
//   .then((response) => {
//     console.log(response);
//     res.send(response);
//   }).catch((reason) => {
//     console.log(reason);
//     res.send(reason);
//   });
// });
