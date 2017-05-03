"use strict";

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
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
  User.find({})
  .exec()
  .then((users) => {
    res.status(200).send(JSON.stringify({
      result: users,
      ok: true,
      error: false
    }));
  }).catch((reason) => {
    res.status(400).send(JSON.stringify({
      error: "Query failed due to: " + reason,
      ok: false,
      result: null
    }));
  });
});

app.get("/dataPoints", (req, res) => {
  DataPoint.find({})
  .exec()
  .then((series) => {
    res.send(JSON.stringify(series));
  }).catch((reason) => {
    throw new Error("No TimeSeries found: " + reason);
  });
});

app.get("/dataPoints/:seriesName", (req, res) => {
  DataPoint.find({
    "seriesName": req.params.seriesName
  }).exec()
  .then((series) => {
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
    res.send("Request failed due to: " + reason);
  });
});

app.get("/seriesNames", (req, res) => {
  DataPoint.find()
  .distinct("seriesName")
  .exec()
  .then((seriesNames) => {
    res.status(200).send({
      result: JSON.stringify(seriesNames),
      ok: true,
      error: null
    });
  }).catch((reason) => {
    res.status(400).send({
      error: "Query failed due to: " + reason,
      ok: false,
      result: null
    });
  });
});

app.get("/tradingHistory", (req, res) => {
  TradingHistory.find({})
  .exec()
  .then((history) => {
    res.send(JSON.stringify(history));
  }).catch((reason) => {
    res.send("Query failed due to: " + reason);
  });
});

app.get("/algorithms", (req, res) => {
  Algorithm.find({})
  .exec()
  .then((algorithms) => {
    res.send(JSON.stringify(algorithms));
  }).catch((reason) => {
    res.send("Query failed due to: " + reason);
  });
});

app.get("/algorithmNames", (req, res) => {
  Algorithm.find()
  .distinct("name")
  .exec()
  .then((algorithmNames) => {
    res.status(200).send(JSON.stringify({
      result: algorithmNames,
      ok: true,
      error: false
    }));
  }).catch((reason) => {
    res.status.send(JSON.stringify({
      error: "Query failed due to: " + reason,
      ok: false,
      result: null
    }));
  });
});

app.get("/algorithms/:algorithmName", (req, res) => {
  let split = req.params.algorithmName.split("_");
  Algorithm.findOne({
    "name": split[0] + " " + split[1]
  }).exec()
  .then((algorithm) => {
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
  }).exec()
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
  let quantity = parseInt(req.body.quantity);
  let seriesName = req.body.seriesName;

  console.log(userName, transactionType, quantity, seriesName);

  DataPoint.find({
    seriesName: seriesName
  }).sort({
    timeStamp: "desc"
  }).limit(1)
  .select("price")
  .exec()
  .then((lastPrice) => {
    User.findOne({
      "userName": userName
    }).exec()
    .then((user) => {
      if(transactionType === "buy") {
        if(user.balance < quantity * lastPrice[0].price) {
          throw new Error("Not enough balance (" + user.balance +
           "). Cost of Transaction: ");
         } else {
           user.balance -= quantity * lastPrice[0].price;
           if(user.portfolio.hasOwnProperty(seriesName)) {
             user.portfolio[seriesName] += quantity
           } else {
             user.portfolio[seriesName] = quantity;
           }
         }
      } else if(transactionType === "sell") {
        if(!user.portfolio[seriesName] || user.portfolio[seriesName] < quantity) {
          throw new Error("Not enough instruments to sell (" +
           user.portfolio[seriesName] + ").");
        } else {
          user.balance += quantity * lastPrice[0].price;
          user.portfolio[seriesName] -= quantity;
        }
      } else {
          throw new Error("Invalid transactionType:" + transactionType);
      }

      if(user.portfolio[seriesName] === null) {
        user.portfolio[seriesName] = 0;
      }

      User.findOneAndUpdate({
        userName: userName
      }, {
        $set: {
          portfolio: user.portfolio,
          balance: user.balance
        }
      },{
        new: true
      }).then((success) => {
        console.log("Updated user: " + success);
        res.status(200).send(JSON.stringify({
          result: success,
          ok: true,
          error: null
        }));
      }).catch((reason) => {
        res.status(400).send(JSON.stringify({
          error: "Update failed: " + reason,
          ok: false,
          result: null
        }));
      });
    }).catch((reason) => {
      res.status(400).send(JSON.stringify({
        error: "Transaction failed: " + reason,
        ok: false,
        result: null
      }));
    });
  }).catch((reason) => {
    res.status(400).send({
      error:"Query failed due to: " + reason,
      ok: false,
      result: null
    });
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
  }).exec()
  .then((dataPoints) => {
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
  }).exec()
  .then((algorithm) => {
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

app.use("/libs/knob.min.css", express.static("../node_modules/knob-js/dist/knob.min.css"));

helper.setRoute("/", "../examples/index.html");
helper.setRoute("/chartTest", "../examples/chartTest.html");
helper.setRoute("/chart_data/test_data", "./data/csv_test.csv");
helper.setRoute("/chart_data/forex_data_test", "./data/test_data.csv");
helper.setRoute("/libs/knob.js", "../node_modules/knob-js/dist/knob.js");
//helper.setRoute("/libs/knob.min.css", "../node_modules/knob-js/dist/knob.min.css");
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
