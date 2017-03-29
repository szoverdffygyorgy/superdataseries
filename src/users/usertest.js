"use strict";

const mongoose = require("mongoose");
const Promise = require("promise");

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost:27017/users");

let User = mongoose.model("User", {name: String, userName: String,
 password: String, profileUrl: String, balance: Number, portfolio: Object});

for(let i = 0; i < 10; i += 1) {
	let user = new User({name: "User" + i, userName: "user" + i, password: "password" + i,
	 profileUrl: "http://www.mukeshambani.com/photo/default.jpg", balance: 10000});

	user.portfolio = {
		"GOOG": i % 2 === 0 ? 10 + i : 20 + i,
		"AAPL": i % 2 === 0 ? 20 + i : 10 + i
	}

	user.save().then((success) => {
    console.log("Successful insert: " + success);
  }).catch((reason) => {
    throw new Error("Insertion was not Successful due to: " + reason);
  });
}
