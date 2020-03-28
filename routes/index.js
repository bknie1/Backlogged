const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

router.get("/", (req, res) => {
	res.render("landing");
});

router.get("/register", (req, res) => {
	res.render("users/new");
});

router.post("/register", (req, res) => {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, user) => {
		if(err) {
			if(err.name == "UserExistsError") {
				return res.render("users/new", {"error": "Username taken"});
			} else {
				console.log(err);
				return res.render("users/new", {"error": err});
			}
		}
		req.flash("success", "You have successfully registered");
		passport.authenticate("local")(req, res, () => {
			res.redirect("/games");
		});
	});

});

router.get("/login", (req, res) => {
	res.render("users/login");
});

router.post("/login", passport.authenticate("local", {
		successRedirect: "/games",
		failureRedirect: "/login"
	}), (req, res) => {
	// Handled by middleware.
});

router.get("/logout", (req, res) => {
	req.logout(); // Destroys all user data in the session.
	req.flash("success", "You have been signed out");
    res.redirect("/");
});

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

module.exports = router;