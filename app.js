// IMPORTS ------------------------------------------------------
const express = require("express");
const bp = require("body-parser");
const mongoose = require("mongoose");
// Seeds --------------------------------------------------------
const seed = require("./seeds/seed");
seed();
// Models -------------------------------------------------------
const Game = require("./models/game");
const Comment = require("./models/comment");
const Tag = require("./models/tag");
const User = require("./models/user");
// GLOBALS ------------------------------------------------------
const app = express();
const port = 3000;
const imageUrlPlaceholder = "https://via.placeholder.com/150/000000/FFFFFF/?text=No%20Image"
// Express -----------------------------------------------------
app.use(express.static("css"));
app.set("view engine", "ejs");
// Body Parser -------------------------------------------------
app.use(bp.urlencoded({extend: true}));
// Mongoose ----------------------------------------------------
mongoose.connect('mongodb://localhost/Gamezy', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to database.");
});
// ROUTES -------------------------------------------------------
app.get("/", (req, res) => {
	res.render("landing");
});

app.get("/games", (req, res) => {
		Game.find({}, null, {sort: {name: 1}}, (err, games) => {
			if(err) {
				console.log("Error: Could not find games.")
			} else {
				// console.log(docs); // DEBUG
				res.render("games/index", {ViewModel: games});
			}
		}
	);
});

app.get("/games/new", (req, res) => {
	res.render("games/new");
});

app.post("/games", (req, res) => {
	let title = req.body.titleInput;
	let system = req.body.systemInput;
	let imageUrl = req.body.imageUrlInput;
	
	newGame(title, system, imageUrl);
	
	res.redirect("/games");
});

app.get("/games/:_id", (req, res) => {
	Game.findById(req.params._id).populate(["comments", "tags"]).exec((err, game) => {
		if(err) {
			console.log(`Error: ${err}`);
			throw err;
			res.redirect("/games");
		} else {
			console.log(`This game: ${game}`); // DEBUG
			res.render("games/show", {ViewModel: game});
		}
	});
});

app.get("/games/:_id/comments/new", (req, res) => {
	Game.findById(req.params._id, (err, game) => {
		if(err) { console.log(`Error: ${err}`)}
		else {
			res.render("comments/new", {ViewModel: game });
		}
	});
});

app.post("/games/:_id/comments", (req, res) => {
	let author = req.body.authorInput;
	let text = req.body.textInput;
	
	// Get game.
	Game.findById(req.params._id, (err, game) => {
		if(err) { console.log(`Error: ${err}`)}
		else {
			Comment.create({author: author, text: text}, (err, comment) => {
				comment.save((err, comment) => {
					if(err) { console.log(`Error: ${err}`) }
					else {
						game.comments.push(comment);
						game.save((err, game) => {
							if(err) { console.log(`Error: ${err}`) }
							else {
								console.log("Comment added to game.");
								res.redirect(`/games/${game._id}`)
							}
						});
					}
				});
			});
		}
	});
});

app.get("*", (req, res) => {
	res.redirect("/");
});

// METHODS -----------------------------------------------------
function newGame(title, system, imageUrl) {
	/// If unique title and system, add. Otherwise, update.
	const filter = {name: title, system: system};
	
	if(Game.exists(filter)) { // INSERT
		if(!imageUrl.length) imageUrl = imageUrlPlaceholder;

		let newGame = new Game({
			title: title, 
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
	} else { // UPDATE
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