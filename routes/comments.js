const express = require("express");
const router = express.Router({mergeParams: true});
// Note: We allow merging of game and comment params.
const Game = require("../models/game");
const Comment = require("../models/comment");
var middleware = require("../middleware"); // Auto gets index.js

// /games/:_id/comments/new/
router.get("/new", middleware.isLoggedIn, (req, res) => {
	Game.findById(req.params._id, (err, game) => {
		if(err) { console.log(`Error: ${err}`)}
		else {
			res.render("comments/new", {ViewModel: game });
		}
	});
});

// /games/:_id/comments/
router.post("/", middleware.isLoggedIn, (req, res) => {
	/// Get game and create a comment on it.
	Game.findById(req.params._id, (err, game) => {
		if(err) { console.log(`Error: ${err}`)}
		else {
			Comment.create({
				text: req.body.comment,
				author: {
					id: req.user._id,
					username: req.user.username
				}
			}, (err, comment) => {
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

// /games/:_id/comments/:_cid/edit
router.get("/:_cid/edit", middleware.checkCommentOwnership, (req, res) => {
/// If the user owns this comment, the user is allowed to edit it.
	Comment.findById(req.params._cid, (err, comment) => {
		if(err) {
			console.log(err);
			return res.redirect("back");
		}
		res.render("comments/edit", {
			ViewModel: comment,
			GameId: req.params._id,
			CommentId: req.params._cid
		});
	});
});

// /games/:_id/comments/:_cid/update
router.put("/:_cid/update", middleware.checkCommentOwnership, (req, res) => {
	/// If the user owns this comment, save the requested updates.
	Comment.findByIdAndUpdate(req.params._cid, req.body.comment, (err, comment) => {
		if(err) {
			console.log(err);
			return res.redirect("/games/" + req.params._id);
		}
		console.log(req.params._id);
		res.redirect("/games/" + req.params._id);
	});
});

// /games/:_id/delete
router.delete("/:_cid/delete", middleware.checkCommentOwnership, (req, res) => {
/// If the user owns this comment, delete, and delete the comment from the Game's comment list.
		Comment.findByIdAndRemove(req.params._cid, (err, comment) => {
			if(err) {
				console.log(err);
				return res.redirect("/games");
			}

		// Also, remove this comment from the Game's comment list.
		Game.findByIdAndUpdate({_id: req.params._id}, {
			$pullAll: {
				comments: [req.params._cid]
			}
		}, (err, game) => {
			if(err) {
				console.log(err);
				return res.redirect("/games/" + req.params._id);
			}
			res.redirect("/games/" + req.params._id);			   
	   });
	});
});



module.exports = router;