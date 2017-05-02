"use strict";

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = require("express")();
const Influx = require("influx");
const http = require("http");
const moment = require("moment");
const Promise = require("promise");
const helper = require("./helper.js")({promise: Promise, app: app});
const request = require("request");

const User = require("./data/models/user");
const DataPoint = require("./data/models/dataPoint");
const TradingHistory = require("./data/models/tradingHistory");
const Algorithm = require("./data/models/algorithm");


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost:27017/users");

app.get("/users", (req, res) => {
  User.find({}).exec().then((users) => {
    res.send(JSON.stringify(users));
  }).catch((reason) => {
    console.log(reason);
  });
});

app.get("/dataPoints", (req, res) => {
  DataPoint.find({}).exec()
  .then((series) => {
    res.send(JSON.stringify(series));
  }).catch((reason) => {
    throw new Error("No TimeSeries found: " + reason);
  });
});

app.get("/dataPoints/:seriesName", (req, res) => {
  DataPoint.find({
    "seriesName": req.params.seriesName
  }).exec().then((series) => {
    let response = [];

    series.forEach((point) => {
      let temp = {
        time: parseInt(point.timeStamp * 1000)
      }

      temp[req.params.seriesName] = point.price;

      response.push(temp);
    });

    res.send(JSON.stringify(response));
  }).catch((reason) => {
    res.send("NOT FOUND");
  });
});

app.get("/seriesNames", (req, res) => {
  DataPoint.find().distinct("seriesName").exec().then((seriesNames) => {
    res.send(JSON.stringify(seriesNames));
  }).catch((reason) => {
    res.send("Query failed due to: " + reason);
  });
});

app.get("/tradingHistory", (req, res) => {
  TradingHistory.find({}).exec().then((history) => {
    res.send(JSON.stringify(history));
  }).catch((reason) => {
    res.send(JSON.stringify(algorithms));
  });
  res.send("Query failed due to: " + reason);
});

app.get("/algorithms", (req, res) => {
  Algorithm.find({}).exec().then((algorithms) => {
    res.send(JSON.stringify(algorithms));
  }).catch((reason) => {
    res.send("Query failed due to: " + reason);
  });
});

app.get("/algorithmNames", (req, res) => {
  Algorithm.find().distinct("name").exec().then((algorithmNames) => {
    res.send(JSON.stringify(algorithmNames));
  }).catch((reason) => {
    res.send("Query failed due to: " + reason);
  });
});

app.get("/algorithms/:algorithmName", (req, res) => {
  let split = req.params.algorithmName.split("_");
  Algorithm.findOne({
    "name": split[0] + " " + split[1]
  }).exec().then((algorithm) => {
    res.send(JSON.stringify(algorithm));
  }).catch((reason) => {
    res.send("NOT FOUND");
  });
});

app.post("/loginrequest", (req, res) => {
  let userName = req.body.user;
  let password = req.body.pass;

  User.findOne({
    "userName": userName,
    "password": password
  }).exec().then((user) => {
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

  User.findOne({
    "userName": userName
  }).exec().then((user) => {
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

app.post("/seriesQuery", (req, res) => {
  let from = parseInt(req.body.from) - 1 || -1;
  let to = parseInt(req.body.to) + 1 || parseInt(moment().unix()) + 1;
  let seriesName = req.body.series;

  DataPoint.find({
    "seriesName": seriesName,
    "timeStamp": {
      $gt: from,
      $lt: to
    }
  }).exec().then((dataPoints) => {
    console.log(dataPoints);
    res.send(JSON.stringify(dataPoints));
  }).catch((reason) => {
    throw new Error("TimeSeries data not found: " + reason);
  });
});

app.post("/runAlgorithm", (req, res) => {
  let algorithmName = req.body.algorithmName;
  let params = req.body.params;

  console.log("LOOKING FOR: " + algorithmName);
  console.log("ALGORITHM PARAMS: " + JSON.stringify(params));

  Algorithm.findOne({
    "name": algorithmName
  }).exec().then((algorithm) => {
    console.log(JSON.stringify(algorithm));
    let serviceUrl = "http://" + algorithm.host + ":" +
     algorithm.port + "/" + algorithm.route;
    let form = {};

    /*params.forEach((prop) => {
      console.log("property: " + prop);
      console.log(JSON.stringify(form));
      form.prop = params.prop;
    });*/
    for(let prop in params) {
      console.log("property: " + prop);
      console.log(JSON.stringify(form));
      form[prop] = params[prop];
    }

    console.log("form: " + JSON.stringify(form));
    console.log("Attempting to connect to: " + serviceUrl);

    request.post(serviceUrl, {
      form: form
    }, (err, response, body) => {
      if(err) {
        throw new Error(err);
      }

      res.send(JSON.stringify(response));
    });
  }).catch((reason) => {
    res.send("Algorithm: " + algorithmName + " NOT FOUND");
  });
});

//app.use(express.static("examples/index.html"));

helper.setRoute("/", "../examples/index.html");
helper.setRoute("/chartTest", "../examples/chartTest.html");
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
