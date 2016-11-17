"use strict";

var express = require("express");
var fs = require("fs");

var app = express();

//app.use(express.static("examples/index.html"));

setRoute("/", "../examples/index.html");
setRoute("/chart_data/test_data", "./data/csv_test.csv");
setRoute("/chart_data/forex_data_test", "./data/test_data.csv");
setRoute("/libs/knob.js", "../node_modules/knob-js/dist/knob.js");
setRoute("/libs/knob.css", "../node_modules/knob-js/dist/knob.min.css");
setRoute("/built/superdataseries.js", "../dist/superdataseries.js");
setRoute("/built/main.built.js", "../examples/main.built.js");
setRoute("/chart_data/formatted", "./data/format.csv");

app.listen(8888, function(){
	console.log("Server is running on port 8888");
});

function readContent(filePath, callback) {
    fs.readFile(filePath, "utf-8", function (err, content) {
        if (err) {
        	return callback(err);
        }

        callback(null, content);
    });
}

function setRoute(route, path) {
    app.get(route, function(req, res) {
        readContent(path, function(err, content) {
            if(err) {
                throw err;
            }

            res.send(content);
        });
    });
}