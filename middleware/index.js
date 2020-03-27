// All the middleware
var middlewareScript = {
	// Authentication --------------------------------------------------
	isLoggedIn: (req, res, next) => {
	if(req.isAuthenticated()) {
		return next();
	}
		res.redirect("/login");
	},
	
	checkGameOwnership: (req, res, next) => {
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
	},
	
	checkCommentOwnership: (req, res, next) => {
		if(req.isAuthenticated()) {
			Comment.findById(req.params._cid, (err, comment) => {
				if(err) {
					console.log(`Error: ${err}`);
					res.redirect("/games/" + req.params._id);
				} else {
					// Does user own comment? Note: Author ID is an Object.
					if(comment.author.id.equals(req.user._id)) {
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
	// /Authentication -------------------------------------------------
}

module.exports = middlewareScript;