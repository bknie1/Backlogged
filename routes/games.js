const express = require("express");
const router = express.Router();
const Game = require("../models/game");
const Comment = require("../models/comment");

const imageUrlPlaceholder = "https://via.placeholder.com/150/000000/FFFFFF/?text=No%20Image";


// /games/
router.get("/", (req, res) => {
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


// /games/new/
router.get("/new", isLoggedIn, (req, res) => {
	res.render("games/new");
});

router.post("/", isLoggedIn, (req, res) => {
	let title = req.body.titleInput;
	let system = req.body.systemInput;
	let imageUrl = req.body.imageUrlInput;
	
	newGame(title, system, imageUrl);
	
	res.redirect("/games");
});

// /games/:_id
router.get("/:_id", (req, res) => {
	Game.findById(req.params._id).populate(["comments", "tags"]).exec((err, game) => {
		if(err) {
			console.log(`Error: ${err}`);
			throw err;
			res.redirect("/games");
		} else {
			res.render("games/show", {ViewModel: game});
		}
	});
});

// Helper Functions ----------------------------------------
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

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
		updateGame(title, system, imageUrl);
	}
}

function updateGame(title, system, imageUrl) {
	Game.updateOne(filter, { name: title, system: system, image: imageUrl });
}

function removeByTitle(title, system) {
	Game.findOneAndRemove({title: title, system: system}, (err,data) => { if(!err) { console.log(`Deleted ${title}`); }});
}

// Export ------------------------------------------------------------

module.exports = router;