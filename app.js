// ==============================================================
// IMPORTS & GLOBALS
// ==============================================================
const express = require("express");
const bp = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local");
const plm = require("passport-local-mongoose");
const seed = require("./seeds/seed");
seed();
// Models -------------------------------------------------------
const Game = require("./models/game");
const Comment = require("./models/comment");
const Tag = require("./models/tag");
const User = require("./models/user");
// Express -----------------------------------------------------
const app = express();
app.use(express.static("css"));
app.set("view engine", "ejs");
// Express Options: Session
app.use(require("express-session")({
    secret: "Purple Kisses",
    resave: false,
    saveUninitialized: false
}));
// Passport ----------------------------------------------------
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate())); // Auth included in PLM
passport.serializeUser(User.serializeUser()); // ser included in PLM
passport.deserializeUser(User.deserializeUser()); // deser included in PLM

app.use((req, res, next) => {
	res.locals.CurrentUser = req.user; // Includes the User in all routes.
	next(); // Required to move forward from this middleware.
});
// Body Parser -------------------------------------------------
app.use(bp.urlencoded({extend: true}));
// Mongoose ----------------------------------------------------
mongoose.connect('mongodb://localhost/Gamezy', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to database.");
});
// Globals ------------------------------------------------------
const port = 3000;
const imageUrlPlaceholder = "https://via.placeholder.com/150/000000/FFFFFF/?text=No%20Image"
// ==============================================================
// ROUTES
// ==============================================================

// Home ---------------------------------------------------------
app.get("/", (req, res) => {
	res.render("landing");
});

// Games --------------------------------------------------------
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

app.get("/games/new", isLoggedIn, (req, res) => {
	res.render("games/new");
});

app.post("/games", isLoggedIn, (req, res) => {
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
			res.render("games/show", {ViewModel: game});
		}
	});
});

app.get("/games/:_id/comments/new",isLoggedIn, (req, res) => {
	Game.findById(req.params._id, (err, game) => {
		if(err) { console.log(`Error: ${err}`)}
		else {
			res.render("comments/new", {ViewModel: game });
		}
	});
});

app.post("/games/:_id/comments", isLoggedIn, (req, res) => {
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
// Authentication -----------------------------------------------
app.get("/register", (req, res) => {
	res.render("users/new");
});

app.post("/register", (req, res) => {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, user) => {
		if(err) {
			if(err.name == "UserExistsError") {
				console.log("User already exists.");
				return res.render("users/new");
			} else {
				console.log(err);
			}
		}
		
		passport.authenticate("local")(req, res, () => {
			res.redirect("/games");
		});
	});

});

app.get("/login", (req, res) => {
	res.render("users/login");
});

app.post("/login", passport.authenticate("local", {
		successRedirect: "/games",
		failureRedirect: "/login"
	}), (req, res) => {
	// Handled by middleware.
});

app.post("/logout", logout, (req, res) => {
	res.redirect("/");
});

// Default ------------------------------------------------------
app.get("*", (req, res) => {
	res.redirect("/");
});
// ==============================================================
// METHODS
// ==============================================================
// Games --------------------------------------------------------
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
	Game.findOneAndRemove({title: title, system: system}, (err,data) => { if(!err){ console.log(`Deleted ${title}`); }});
}
// Login --------------------------------------------------------
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

function logout() {
	app.logout();
}
// ==============================================================
// START/LISTEN
// ==============================================================
app.listen(port, () => { console.log(`Listening on port ${port}`); });