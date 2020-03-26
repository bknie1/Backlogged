// ==============================================================
// IMPORTS, SETUP, & GLOBALS
// ==============================================================
const express = require("express");
const bp = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local");
const plm = require("passport-local-mongoose");
const seed = require("./seeds/seed");
// seed(); // DEMO PURPOSES ONLY
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
// ==============================================================
// ROUTES
// ==============================================================
const indexRoutes = require("./routes/index");
const gameRoutes = require("./routes/games");
const commentRoutes = require("./routes/comments");

app.use(indexRoutes);
app.use("/games/", gameRoutes);
app.use("/games/:id/comments", commentRoutes);
// Default ------------------------------------------------------
app.get("*", (req, res) => {
	res.redirect("/");
});
// ==============================================================
// START/LISTEN
// ==============================================================
app.listen(port, () => { console.log(`Listening on port ${port}`); });