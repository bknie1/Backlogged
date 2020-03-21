// IMPORTS ------------------------------------------------------
const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("css"));
app.set("view engine", "ejs");
// Body Parser -------------------------------------------------
const bp = require("body-parser");
app.use(bp.urlencoded({extend: true}));

// Mongoose ----------------------------------------------------
const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/Gamezy', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to database.");
});

// Schemas -----------------------------------------------------
const gameSchema = new mongoose.Schema({
	name: String,
	system: String,
	image: String,
	tags: String
});

const Game = mongoose.model("Game", gameSchema);
// ROUTES -------------------------------------------------------

app.get("/", (req, res) => {
	res.render("landing");
});

app.get("/games", (req, res) => {
	getGamesAndRenderView(req, res);
});

app.get("/games/new", (req, res) => {
	res.render("new");
});

app.post("/games", (req, res) => {
	let title = req.body.titleInput;
	let system = req.body.systemInput;
	let imageUrl = req.body.imageUrlInput;
	
	addGame(title, system, imageUrl);
	
	res.redirect("/games");
});

app.get("*", (req, res) => {
	res.redirect("/");
});

// METHODS -----------------------------------------------------
function getGamesAndRenderView(req, res) {
	/// Get all games or a specific game by title.
	Game.find({}, null, {sort: {name: 1}}).lean().exec((err, docs) => {
		if(err) {
		  console.log("Error: Could not find games.")
		} else {
			console.log(docs);
			res.render("games", {ViewModel: docs});
		}
	});
}

function addGame(title, system, imageUrl) {
	/// If unique title and system, add. Otherwise, update.
	const filter = {name: title, system: system};
	
	if(Game.exists(filter)) {
		// INSERT Game
		if(!imageUrl.length) { // Placeholder Image
			imageUrl = "https://via.placeholder.com/150/000000/FFFFFF/?text=No%20Image"
		}

		let newGame = new Game({
			name: title, 
			system: system, 
			image: imageUrl
		});

		newGame.save((err, g) => {
			if(err) {
				console.log(err);
			} else {
				console.log(`Added ${g}`);
			}
		});
	} else {
		console.log("Duplicate entry. Updating.");
		updateGame(title, system, imageUrl);
	}
}

function updateGame(title, system, imageUrl) {
	Game.updateOne(filter, { name: title, system: system, image: imageUrl });
}

function removeByTitle(title, system) {
	Game.findOneAndRemove({title: title, system: system}, (err,data) => { if(!err){ console.log(`Deleted ${title}`); }});
}

// LISTEN ------------------------------------------------------
app.listen(port, () => { console.log(`Listening on port ${port}`); });