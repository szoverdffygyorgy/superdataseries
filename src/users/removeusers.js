"use strict";

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/users');

var User = mongoose.model("User", {name: String, userName: String,
 password: String, profileUrl: String, balance: Number, portfolio: Object});

User.remove({}, (err) => {
	if(err) {
		throw new Error(err);
	} else {
		console.log("Deleted users");
	}
});