// ==============================================================
// IMPORTS, SETUP, & GLOBALS
// ==============================================================
const express 			= require("express");
const bp 				= require("body-parser");
const flash				= require("connect-flash");
const mongoose 			= require("mongoose");
const passport 			= require("passport");
const localStrategy 	= require("passport-local");
const methodOverride 	= require("method-override"); // Required for PUT
const plm 				= require("passport-local-mongoose");
const seed 				= require("./seeds/seed");
// seed(); // DEMO PURPOSES ONLY
// Models -------------------------------------------------------
const Game 				= require("./models/game");
const Comment 			= require("./models/comment");
const Tag 				= require("./models/tag");
const User 				= require("./models/user");
// Express and Modules ------------------------------------------
const app = express();

app.use(express.static("public")); // js, css, etc.

app.set("view engine", "ejs"); // EJS is a dependency
// Express Options: Session
app.use(require("express-session")({
    secret: "Purple Kisses",
    resave: false,
    saveUninitialized: false
}));

app.use(bp.urlencoded({extended: true}));
app.use(flash()); // Requires express-sesssion
app.use(methodOverride("_method")); // For PUT requests
// Passport ----------------------------------------------------
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate())); // Auth included in PLM
passport.serializeUser(User.serializeUser()); // ser included in PLM
passport.deserializeUser(User.deserializeUser()); // deser included in PLM
// Mongoose ----------------------------------------------------
mongoose.connect('mongodb://localhost/Backlogged', {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.set('useFindAndModify', false);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to database.");
});
// Locals -------------------------------------------------------
app.use((req, res, next) => {
	res.locals.currentUser = req.user; // Includes the User in all routes.
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next(); // Required to move forward from this middleware.
});
// Globals ------------------------------------------------------
const port = 3000;
// Helpers ------------------------------------------------------
app.locals.isCommentOwner = (userId, commentId) => {
		/// Is this comment owned by the current user?
		Comment.findById(commentId, (err, comment) => {
		if(comment.author.id.toString() == userId) {
			return true;
		}
		return false;
	});
}
// ==============================================================
// ROUTES
// ==============================================================
const indexRoutes = require("./routes/index");
const gameRoutes = require("./routes/games");
const commentRoutes = require("./routes/comments");

app.use(indexRoutes);
app.use("/games/", gameRoutes);
app.use("/games/:_id/comments", commentRoutes);
// Default ------------------------------------------------------
app.get("*", (req, res) => {
	res.redirect("/");
});
// ==============================================================
// START/LISTEN
// ==============================================================
app.listen(port, () => { console.log(`Listening on port ${port}`); });