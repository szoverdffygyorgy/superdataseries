"use strict";

const mongoose = require("mongoose");
const Promise = require("promise");

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost:27017/users");

let User = mongoose.model("User", {name: String, userName: String,
 password: String, profileUrl: String, balance: Number, portfolio: Object});

User.remove({}).then((success) => {
  console.log("Removal was Successful." + success);
}).catch((reason) => {
  console.log("Removal failed due to: " + reason);
});
