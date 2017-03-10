"user strict";

var mongoose = require('mongoose');
var bodyParser = require("body-parser");
var express = require("express");

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/users');

var User = mongoose.model("User", {name: String, userName: String,
 password: String, profileUrl: String, balance: Number});

app.post("/loginrequest", function(req, res) {
    var userName = req.body.user;
    var password = req.body.pass;

    User.find({"userName": userName}, function(err, user) {
        if(err) {
            throw new Error(err);
        } else {
            console.log(user);
            res.send(JSON.stringify(user[0]));
        }
    });
});

app.listen(7777, function(){
	console.log("Login Server is running on port 7777");
});