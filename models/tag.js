const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
	name: String,
	games: [
		{
			type: mongoose.Schema.Types.ObjectId, 
			ref: "Game"
		}
	]
});

module.exports = new mongoose.model("Tag", tagSchema);