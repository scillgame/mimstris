# SCILL @ Mimstris

The SCILL team implemented [SCILL Gamification as a Service](https://www.scillgame.com) into this awesome game to show
off how easy it is to implement SCILL into any application. But of course it's best suited to add to games.

We love Tetris and this version because it's so smartly implemented and because it's a very good example what challenges
bring to a game: A whole new dimension. While the original game is a lot of fun, it quickly gets boring as you only have
a personal highscore to beat.

Challenges however, bring a complete new experience to this game. We played for hours finding the best strategy to solve
that "5 Lines of same color" challenge. It took minutes to implement, but brought many, many hours of playtime for many
of us, because it's such an interesting challenge to solve.

Try yourself: 
* [Original version of the game](https://mimstris.surge.sh) 
* [Tetris powered by SCILL challenges](https://scill-tetris.web.app/) 

## SCILL Challenges

SCILL empowers developers to leverage gamification features in their games and applications. SCILL consists of these
components:

* Backend with REST-API
* Admin Panel for setting up you app, challenges and battle passes
* SDKs for JavaScript, Unity, PHP, etc.

## Implementation

The game sends a couple of [destroy-items](https://developers.scillgame.com/events.html#destroy-item) events with `item_id`
being `line` for basic lines, `block` for a block of 4 lines and `sameColor` for a line with the same color. This way,
we could create three challenges, listing for the events. The "5 Lines of Same Color" Event for example listens for the
`destroy-items` event with `item_id == sameColor`. So, whenever this event comes in the counter of that challenge will
increase.

The whole power of the system is, that it's cloud based and data driven. We can change the whole game by adding a new
challenge and this challenge will show up for everyone playing the game in real time. Without you having to deploy a 
new version of the game.

SCILL requires a `user_id` to track progress for users. This can be anything, in this case a random `user_id` is created
once the game starts for the first time and is stored in `localStorage`. So if you want to start from scratch, you need
to remove that entry. 

SCILL offers persistent challenges and round/match based challenges. In this case, we have implemented both: The "Same Color"
challenge is persistent, i.e. it keeps state over multiple games (try yourself and reload the app), while the "Complete
10 lines" challenges resets for every match start. The `session_id` of the Event system makes all the difference here.
More info on this topic can be found in our developers documentation: 
[How events relate to challenges](https://developers.scillgame.com/api/events.html#how-events-relate-to-challenges).

In this game, the `session_id` is recreated every time the match starts.

# Mimstris (Original Readme)

An arcade puzzle game created in JS using [React](https://facebook.github.io/react/) / [Redux](http://redux.js.org/).

**This game is open-source, free, and just for funsies!**

## 👉 [Play Now!](https://scill-tetris.web.app/)  🎮 📺

[![Screen Shot](screenshot.gif)](htts://mimstris.surge.sh)

## Motivation
After watching [Meth Meth Method's video](https://www.youtube.com/watch?v=H2aW5V46khA) I was inspired to create a similar game for the following reasons:

  1. To try my hand at making a game using functional programming methodologies.
  1. To try out some JS tools that I hadn't used before
  1. I thought it would be fun to make up crazy custom shapes and/or game modes.

Some of the tools I used:

  - [redux](http://redux.js.org/) for state management
  - [reselect](https://github.com/reactjs/reselect) for memoized selectors
  - [react](https://facebook.github.io/react/) for component rendering
  - [Ducks](https://github.com/erikras/ducks-modular-redux) for module organization
  - [AVA](https://github.com/avajs/ava) for unit tests and [nyc](https://github.com/istanbuljs/nyc) for code coverage
  - [lodash](https://lodash.com/) for numerous utility functions
  - [random-seed](https://github.com/skratchdot/random-seed) to create a deterministic game mode (where every game is the same order of pieces)
  - [pressed](https://github.com/mimshwright/pressed.js) for detecting key presses in update loop (I created this library for this project)
  - babel, webpack, standard (code style)
  - ES6

## Controls

| Key   | Action |
| ----- | ------ |
| Left, A  | Left   |
| Right, D | Right  |
| Down, S  | Down   |
| Shift, Up    | Rotate Right |
| Z, /    | Rotate Left |
| Enter    | Pause / Restart Game |
