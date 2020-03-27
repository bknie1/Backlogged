const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
	username: String,
	password: String,
	email: String,
	games: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Game",
			status: String // Not Started, In Progress, Completed
		}
	]
});

userSchema.plugin(plm);

module.exports = new mongoose.model("User", userSchema);