// IMPORTS ------------------------------------------------------
const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("css"));
app.set("view engine", "ejs");
// Body Parser --------------------------------------------------
const bp = require("body-parser");
app.use(bp.urlencoded({extend: true}));
// Mongoose -----------------------------------------------------
const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/Gamezy', {useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to database.");
});
// Schemas ------------------------------------------------------
var gameSchema = new mongoose.Schema({
	name: String,
	system: String,
	image: String
});

var Game = mongoose.model("Game", gameSchema);
// ROUTES -------------------------------------------------------

app.get("/", (req, res) => {
	res.render("landing");
});

app.get("/games", (req, res) => {
	// let games = getAllGames();
	
	let games = [{"name": "Crash Bandicoot", "system": "PlayStation", "image": "#"}];
	
	res.render("games", {ViewModel: games});
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

// METHODS ------------------------------------------------------
function getAllGames() {
	let games = {};
	
	return games;
}

function addGame(title, system, imageUrl) {
	// If unique title and system, add.
	Game.find({name: title, system: system}, (err, games) => {
		if (err) return console.error(err);
  		console.log(games);
		
		if(games === undefined || games.length == 0) {
			console.log("Unique game.");
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
			console.log("Error: Duplicate game.");
		}
	});
}

function removeByTitle(title, system) {
	Property.findOneAndRemove({title: title, system: system}, (err,data) => { if(!err){ console.log(`Deleted ${title}`); }});
}

// LISTEN -------------------------------------------------------
app.listen(port, () => { console.log(`Listening on port ${port}`); });