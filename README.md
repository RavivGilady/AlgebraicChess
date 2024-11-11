Currently in order to make environment ready (Currently only windows x64, because of stockfish binary download), we need to run
```bash
npm run setup
```

In order to start both server & client:
```bash
npm start
```

Game Mechanism:
- [ ] Basic matchmaking between two players who wish to play against a human player
- [ ] Creating a game against a bot, specifying its elo

Frontend:
- [ ] Enable a user to start a game against a human/bot
- [ ] Managing a game for the user

Backend:
- [ ] Add support for google/facebook/chess.com(is that a thing?) authentication
- [ ] Add support for requesting user data
- [ ] Add support for viewing user's games
- [ ] Save a game once it's over

General Project:
- [ ] Make setup script os agnostic
- [ ] Improve Readme

Far Future Backlog:
- [ ] Researching adding more variety of bots as in chess.com (Stockfish is using elo and depth, where elo is minimum 1350)
- [ ] Create a different entity for managing games using Redis for in-memory db for ongoing games
- [ ] Research advanced matchmaking based on elo. Maybe use another entity to create this matchmaking (Again using Redis)
- [ ] Create sub-processes for bot players so that server won't rely on bot's fast/slow response for games
