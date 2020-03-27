const express = require("express");
const router = express.Router();
const Game = require("../models/game");
const Comment = require("../models/comment");
const locus = require("locus");

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

// /games/
router.post("/", isLoggedIn, (req, res) => {
	let title = req.body.title;
	let system = req.body.system;
	let year = req.body.year;
	let description = req.body.description;
	let imageUrl = req.body.image;
	
	// If unique title and system, add. Otherwise, update.
	const filter = {name: title, system: system};
	
	if(!imageUrl.length || imageUrl === undefined) imageUrl = imageUrlPlaceholder;
	if(year.isNaN) res.redirect("/new");
	
	if(Game.exists(filter)) { // INSERT

		let newGame = new Game({
			title: title, 
			system: system,
			year: year,
			description: description,
			image: imageUrl,
			author: {
				id: req.user._id,
				username: req.user.username
			}
		});

		newGame.save((err, g) => {
			if(err) {
				console.log(err);
				return res.redirect("/");
			}
			// console.log(`Added ${g}`); // DEBUG
		});
	} else { // UPDATE
		// Update all but the author of the original game.
		Game.updateOne(filter, {
			name: title,
			description: description,
			year: year,
			system: system,
			image: imageUrl
		});
	}
	
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
			let isGameAuthor = false;
			let authorId = undefined;
			
			res.render("games/show", {
				ViewModel: game
			});
		}
	});
});

// /games/:_id/edit
router.get("/:_id/edit", checkGameOwnership, (req, res) => {
	Game.findById(req.params._id, (err, game) => {
		if(err) {
			console.log(err);
			return res.redirect("back");
		}
		res.render("games/edit", {ViewModel: game});
	});
});

// /games/:_id/update
router.put("/:_id/update", checkGameOwnership, (req, res) => {
	// Because our input names are in game[dataPoint] format,
	// we can just pass body's game variable.
	Game.findByIdAndUpdate(req.params._id, req.body.game, (err, game) => {
		if(err) {
			console.log(err);
			return res.redirect("back");
		}
		res.redirect("/games/" + req.params._id);
	});
});

// /games/:_id/delete
router.delete("/:_id/delete", checkGameOwnership, (req, res) => {
	Game.findByIdAndRemove(req.params._id, (err, game) => {
		if(err) {
			console.log(err);
			return res.redirect("back");
		}
		
		// Also, delete all comments associated with this game.
		Comment.deleteMany( {_id: { $in: game.comments } }, (err) => {
			if(err) {
				console.log(err);
				return res.redirect("back");
			}
			res.redirect("/games");
		});
	});
});

// Helper Functions ----------------------------------------
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

function checkGameOwnership(req, res, next) {
	if(req.isAuthenticated()) {
		Game.findById(req.params._id, (err, game) => {
			if(err) {
				console.log(`Error: ${err}`);
				res.redirect("/games/" + req.params._id);
			} else {
				// Does user own game? Note: Author ID is an Object.
				if(game.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect("back");
				}
			}
		});
	} else {
		res.redirect("back");
	}
}
// Export ------------------------------------------------------------

module.exports = router;