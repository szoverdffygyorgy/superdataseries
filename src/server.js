"use strict";

var express = require("express");
var fs = require("fs");

var app = express();

//app.use(express.static("examples/index.html"));

app.get("/", function(req, res) {
    readContent("../examples/index.html", function(err, content) {
        if(err) {
            throw err;
        }

        res.send(content);
    });
});

app.get("/chart_data/test_data", function(req, res) {
	readContent("./data/csv_test.csv", function(err, content) {
    	if(err) {
    		throw err;
    	}

    	res.send(content);
	});
});

app.get("/chart_data/forex_data_test", function(req, res) {
	readContent("./data/test_data.csv", function(err, content) {
		if(err) {
			throw err;
		}

		res.send(content);
	});
});

app.get("/libs/knob.js", function(req, res) {
    readContent("../node_modules/knob-js/dist/knob.js", function(err, content) {
        if(err) {
            throw err;
        }

        res.send(content);
    });
});

app.get("/libs/knob.css", function(req, res) {
    readContent("../node_modules/knob-js/dist/knob.min.css", function(err, content) {
        if(err) {
            throw err;
        }

        res.send(content);
    });
});

app.get("/built/superdataseries.js", function(req, res) {
    readContent("../dist/superdataseries.js", function(err, content) {
        if(err) {
            throw err;
        }

        res.send(content);
    });
});

app.get("/built/main.built.js", function(req, res) {
    readContent("../examples/main.built.js", function(err, content) {
        if(err) {
            throw err;
        }

        res.send(content);
    });
});

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