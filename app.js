const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("css"));
app.set("view engine", "ejs");

var bp = require("body-parser");
app.use(bp.urlencoded({extend: true}));

// ROUTES --------------------------------------------------------------

app.get("/", (req, res) => {
	res.render("landing");
});

var games = [
	{name: "Crash Bandicoot",
	 system: "PlayStation",
	 image: "https://www.mobygames.com/images/covers/l/86029-crash-bandicoot-playstation-front-cover.jpg"
	},
	{name: "Croc",
	 system: "PlayStation",
	 image: "https://www.mobygames.com/images/covers/l/34798-croc-legend-of-the-gobbos-playstation-front-cover.jpg"
	},
	{name: "Syphon Filter",
	 system: "PlayStation",
	 image: "https://www.mobygames.com/images/covers/l/22046-syphon-filter-playstation-front-cover.jpg"
	},
	{name: "Twisted Metal",
	 system: "PlayStation",
	 image: "https://www.mobygames.com/images/covers/l/62728-twisted-metal-playstation-front-cover.jpg"
	},
];

app.get("/games", (req, res) => {
	res.render("games", {ViewModel: games});
});

app.get("/games/new", (req, res) => {
	res.render("new");
});

app.post("/games", (req, res) => {
	let title = req.body.titleInput;
	let system = req.body.systemInput;
	let imageUrl = req.body.imageUrlInput;
	
	games.push({name: title, system: system, image: imageUrl});
	
	res.redirect("/games");
});

app.get("*", (req, res) => {
	res.redirect("/");
});

function getGameData(title) {
	// https://api-docs.igdb.com/
	// https://www.mobygames.com/info/api
}

app.listen(port, () => { console.log(`Listening on port ${port}`); });