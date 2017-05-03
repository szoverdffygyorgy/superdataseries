"use strict";

const mongoose = require("mongoose");
const Promise = require("promise");
const User = require("../../models/user");

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost:27017/users");

User.remove({}).then((success) => {
  console.log("Removal was Successful." + success);
  mongoose.disconnect();
}).catch((reason) => {
  console.log("Removal failed due to: " + reason);
});
