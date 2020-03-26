const mongoose = require("mongoose");
const User = require("../models/user");
const Comment = require("../models/comment");
const Tag = require("../models/tag");
const Game = require("../models/game");

const placeholder = "https://via.placeholder.com/150/000000/FFFFFF/?text=No%20Image"

function seedDB() {
	const games  = [
		{
			title: "Crash Bandicoot",
			system: "PlayStation",
			image: placeholder,
			description: "Anyone else would get judged for being shirtless.",
			comments: []			
		},
		{
			title: "Jumping Flash",
			system: "PlayStation",
			image: placeholder,
			description: "Rabbits on acid.",
			comments: []			
		},
		{
			title: "Twisted Metal",
			system: "PlayStation",
			image: placeholder,
			description: "90's destruction derby power violence.",
			comments: []			
		},
		{
			title: "Syphon Filter",
			system: "PlayStation",
			image: placeholder,
			description: String,
			comments: []			
		},
		{
			title: "Croc: Legend of the Gobbos",
			system: "PlayStation",
			image: placeholder,
			description: "A lizard and his furby collection.",
			comments: []			
		},
		{
			title: "Blue Stinger",
			system: "Dreamcast",
			image: placeholder,
			description: "An even campier knock-off of Resident Evil.",
			comments: []			
		},
		{
			title: "Shenmue",
			system: "Dreamcast",
			image: placeholder,
			description: "Do you know where sailors hang out?",
			comments: []			
		},
		{
			title: "Yakuza Kiwami",
			system: "PlayStation 4",
			image: placeholder,
			description: "Help a pompadour gang find their new groove.",
			comments: []			
		},
	];
	
	const comments = [
		{
			text: "Nice game.",
			author: "BMK"
		}
	]
	
	const users = [
		{
			username: "test",
			email: "test@test.com"
		}
	];
	
	const tags = [
		{
			name: "Platformer",
			games: []			
		},
		{
			name: "Puzzle",
			games: []			
		},
		{
			name: "Action",
			games: []			
		},
		{
			name: "Roleplaying",
			games: []			
		},
		{
			name: "Adventure",
			games: []			
		},
		{
			name: "Turn-Based",
			games: []			
		},
		{
			name: "Shooter",
			games: []			
		},
	];
	
	// Delete & Instantiate
	Game.deleteMany({}, (err) => {
		if(err) {
			console.log(`Error: ${err}`);
		} else {
			console.log(`Removed all games.`);
			
			games.forEach((game) => {
				Game.create(game, (err, game) => {
						if(err) { console.log(`Error: ${err}`)}
						else {
							Tag.create(tags[0], (err, tag) => {
								if(!err) {
									game.tags.push(tag);
									game.save();
									
									Comment.create(comments[0], (err, comment) => {
										if(!err) {
											game.comments.push(comment);
											game.save();
										}
									});
								}
							});
						}
					});
				});
			console.log(`Added new games.`);
		}
	});
	
	User.deleteMany({}, (err) => {
		if(err) {
			console.log(`Error: ${err}`);
		} else {
			console.log(`Removed all users.`);
			users.forEach((data) => {
			User.create(data, (err, doc) => {
					if(err) { console.log(`Error: ${err}`)}
				});
			});
			console.log(`Added new users.`);
		}
	});
	
	Comment.deleteMany({}, (err) => {
		if(err) {
			console.log(`Error: ${err}`);
		} else {
			console.log(`Removed all comments.`);
		}
	});
	
	Tag.deleteMany({}, (err) => {
		if(err) {
			console.log(`Error: ${err}`);
		} else {
			console.log(`Removed all tags.`);
			tags.forEach((data) => {
			Tag.create(data, (err, doc) => {
					if(err) { console.log(`Error: ${err}`)}
				});
			});
			console.log(`Added new tags.`);
		}
	});
}

module.exports = seedDB;