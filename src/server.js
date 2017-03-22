"use strict";

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");
const Influx = require("influx");
const fs = require("fs");
const http = require("http");

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/users");

var User = mongoose.model("User", {name: String, userName: String,
 password: String, profileUrl: String, balance: Number, portfolio: Object});

app.post("/loginrequest", (req, res) => {
    var userName = req.body.user;
    var password = req.body.pass;

    User.findOne({"userName": userName, "password": password}, (err, user) => {
        if(err) {
            throw new Error(err);
        } else {
            console.log(user);
            var response = {
                userName: user.userName,
                name: user.name,
                profileUrl: user.profileUrl,
                balance: user.balance
            };

            res.send(JSON.stringify(response));
        }
    });
});

app.post("/transaction", (req, res) => {
    var userName = req.body.user;
    var transactionType = req.body.transactionType;
    var transactionValue = parseInt(req.body.transactionValue);

    User.findOne({"userName": userName}, (err, user) => {
        if(err) {
            throw new Error(err);
        } else {
            if(transactionType === "buy") {
                user.balance -= transactionValue;
            } else if(transactionType === "sell") {
                user.balance += transactionValue;
            } else {
                throw new Error("Invalid transactionType:" + transactionType);
            }

            user.save((err) => {
                if(err) {
                    throw new Error(err);
                } else {
                    console.log("SAVED/UPDATED", user);
                }
            });

            res.send(JSON.stringify(user.balance));
        }
    });
});

//app.use(express.static("examples/index.html"));

setRoute("/", "../examples/index.html");
setRoute("/chart_data/test_data", "./data/csv_test.csv");
setRoute("/chart_data/forex_data_test", "./data/test_data.csv");
setRoute("/libs/knob.js", "../node_modules/knob-js/dist/knob.js");
setRoute("/libs/knob.min.css", "../node_modules/knob-js/dist/knob.min.css");
setRoute("/built/superdataseries.js", "../dist/superdataseries.js");
setRoute("/built/main.built.js", "../examples/main.built.js");
setRoute("/chart_data/formatted50", "./data/format50.csv");
setRoute("/chart_data/formatted100", "./data/format100.csv");
setRoute("/chart_data/formatted500", "./data/format500.csv");

app.listen(8888, () => {
	console.log("Host Server is running on port 8888");
});

app.get("/influx_test", (req, res) => {
    http.get("http://localhost:8086/query?chunked=true&db=test&epoch=ns&q=SELECT+%2A+FROM+treasures",
     (response) => {
        response.setEncoding("utf-8");
        let rawData = "";

        response.on("data", (chunk) => {
            rawData += chunk;
        });

        response.on("end", () => {
            let parsedData = JSON.parse(rawData);
            console.log(parsedData);
            res.send(parsedData);
        });
     })
});

const influx = new Influx.InfluxDB({
  host: 'localhost:8086',
  database: 'pirates',
  schema: [
      {
          measurement: 'treasures',
          fields: {
          captain_id: Influx.FieldType.STRING,
          value: Influx.FieldType.INTEGER
          },
      tags: []
      }
  ]
});

app.get("/influx_node_test", (req, res) => {
    influx.query(/*"SELECT * FROM test.autogen.treasures "*/"SELECT * FROM time" +
    "SeriesTest.autogen.HUFUSD").then((response) => {
      console.log(response);
        res.send(response);
    }).catch((reason) => {
        console.log(reason);
        res.send(reason);
    });
});

function readContent(filePath, callback) {
    fs.readFile(filePath, "utf-8", (err, content) => {
        if (err) {
        	return callback(err);
        }

        callback(null, content);
    });
}

function setRoute(route, path) {
    app.get(route, (req, res) => {
        readContent(path, function(err, content) {
            if(err) {
                throw err;
            }

            res.send(content);
        });
    });
}
