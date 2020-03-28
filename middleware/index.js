// All the middleware
const Game = require("../models/game");
const Comment = require("../models/comment");

var middlewareScript = {
	// Authentication --------------------------------------------------
	isLoggedIn: (req, res, next) => {
	if(req.isAuthenticated()) {
		return next();
	}
		req.flash("error", "You need to be signed in to do that");
		res.redirect("/login");
	},
	
	checkGameOwnership: (req, res, next) => {
		if(req.isAuthenticated()) {
			Game.findById(req.params._id, (err, game) => {
				if(err) {
					console.log(`Error: ${err}`);
					req.flash("error", "Game not found");
					res.redirect("back");
				} else {
					// Does user own game? Note: Author ID is an Object.
					if(game.author.id.equals(req.user._id)) {
						next();
					} else {
						req.flash("error", "You do not have permission to edit this");
						res.redirect("back");
					}
				}
			});
		}
	},
	
	checkCommentOwnership: (req, res, next) => {
		if(req.isAuthenticated()) {
			Comment.findById(req.params._cid, (err, comment) => {
				if(err) {
					console.log(`Error: ${err}`);
					req.flash("error", "Comment not found");
					res.redirect("/games/" + req.params._id);
				} else {
					// Does user own comment? Note: Author ID is an Object.
					if(comment.author.id.equals(req.user._id)) {
						next();
					} else {
						req.flash("error", "You do not have permission to edit this");
						res.redirect("back");
					}
				}
			});
		}
	}
	// /Authentication -------------------------------------------------
}

module.exports = middlewareScript;