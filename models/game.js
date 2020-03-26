const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
	title: String,
	system: String,
	year: String,
	image: String,
	description: String,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	],
	tags: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Tag"
		}
	],
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

module.exports = mongoose.model("Game", gameSchema);