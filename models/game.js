const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
	title: String,
	system: String,
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
	]
});

module.exports = mongoose.model("Game", gameSchema);