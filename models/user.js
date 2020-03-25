const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
	username: String,
	password: String,
	email: String
});

userSchema.plugin(plm);

module.exports = new mongoose.model("User", userSchema);