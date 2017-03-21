"use strict";

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/users');

var User = mongoose.model("User", {name: String, userName: String,
 password: String, profileUrl: String, balance: Number, portfolio: Object});

for(var i = 0; i < 10; i += 1) {
	var user = new User({name: "User" + i, userName: "user" + i, password: "password" + i,
	 profileUrl: "http://www.mukeshambani.com/photo/default.jpg", balance: 10000});

	user.portfolio = {
		"GOOG": i % 2 === 0 ? 10 + i : 20 + i,
		"AAPL": i % 2 === 0 ? 20 + i : 10 + i
	}

	user.save(function(err) {
		if(err) {
			throw new Error(err);
		} else {
			console.log(user.name + " user has been successfully created!");
		}
	});
}
