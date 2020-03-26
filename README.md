# Gamezy
Find new games to play, rating system, comments.

## Why?

I love the MEAN stack and haven't done it in a few years, so I am refreshing my skill set. I feel that JavaScript based stacks are far easier to spin up. ASP feels slow, bulky, and restrictive.

I am also creating this repository so I can quickly demonstrate my understanding of RESTful web applications with data persistance.

## Features

Gamezy allows user to register, add games, and comment on games. For demo purposes, the database is cleared and seeded on boot.

## Stack

### Front
Bootstrap 4
jQuery
EJS (Embedded JavaScript)

### Back
- Node.js and NPM
- Express.js
- Express Session (Session Interface)
- Method Override (Allows PUT requests)
- Body Parser
- Mongoose (Interface for MongoDB)
- Passport, Passport Local, Passport Local Mongoose (Authentication)

MongoDB / NoSQL

## Architecture

### Routing
Gamezy is a RESTful web app. Routes are predictable and easy to navigate. e.g. /games/new navigates to a new game form, /user/new navigates to an account registration form. This way, power users can easily guess a given route, even if they do not know how to immediately navigate to it.

### Authentication
Accounts are required to add games and create comments. We use Passport.js as middleware and Express Session to create users, authenticate users, determine access, and sign users out. Future iterations may be have tiered access.

The Session tracks the current user. We can use this to edit the View state on pages e.g. if a user is logged in, they do not see the Sign Up/In prompts.

### Schemas and their Models

#### Games
Games feature a title, system, and image; usually cover art. Games own a list of comments associated with them. Games also own a list of tags to help sort them by genre.

#### Comment
Each comment consists of an author and text.

#### Tag
Tags help sort Games by genre. They have a name property. Also, each Tag owns a list of games associated with it. Eventually, users will be able to create their own tags.

#### User
Users rely on Passport.js and a local storage strategy. Usernames are visible, but passwords are hashed. They also include an email field, which may later be used for account recovery.

The Users schema also uses the Passport Local Mongoose plugin, which grants it a series of additional methods used for authentication.
