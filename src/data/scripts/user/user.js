"use strict";

const mongoose = require("mongoose");
const Promise = require("promise");
const User = require("../../models/user");

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost:27017/users");

for(let i = 0; i < 10; i += 1) {
	let user = new User({
    name: "User" + i,
    userName: "user" + i,
    password: "password" + i,
    profileUrl: "http://www.mukeshambani.com/photo/default.jpg",
    balance: 10000
  });

	user.portfolio = {
		"GOOG": i % 2 === 0 ? 10 + i : 20 + i,
		"AAPL": i % 2 === 0 ? 20 + i : 10 + i
	}

	user.save().then((success) => {
    console.log("Successful insert: " + success);
		User.find().count().exec().then((count) => {
			if(count === 10) {
				mongoose.disconnect();
			}
		}).catch((reason) => {
			throw new Error("Error in querying the number of elements in collection " + reason);
		});
  }).catch((reason) => {
    throw new Error("Insertion was not Successful due to: " + reason);
  });
}
