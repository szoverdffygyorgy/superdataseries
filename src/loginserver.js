"user strict";

var express = require("express");

var app = express();

app.post("/loginrequest", function(req, res) {
    var userName = req.param("user");
    var password = req.param("pass");

    res.send("post message was successful");

    console.log("user=" + userName + " pw=" + password);
});

app.listen(7777, function(){
	console.log("Login Server is running on port 7777");
});