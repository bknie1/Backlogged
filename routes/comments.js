const express = require("express");
const router = express.Router();
const Game = require("../models/game");
const Comment = require("../models/comment");

router.get("/new",isLoggedIn, (req, res) => {
	Game.findById(req.params._id, (err, game) => {
		if(err) { console.log(`Error: ${err}`)}
		else {
			res.render("comments/new", {ViewModel: game });
		}
	});
});

router.post("/", isLoggedIn, (req, res) => {
	let author = req.body.authorInput;
	let text = req.body.textInput;
	
	/// Get game and create a comment on it.
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
								res.redirect(`/games/${game._id}`)
							}
						});
					}
				});
			});
		}
	});
});

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

module.exports = router;