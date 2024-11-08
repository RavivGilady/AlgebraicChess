const Game = require('./Game/game');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const BotPlayer = require('./players/BotPlayer');
const HumanPlayer = require('./players/HumanPlayer');
const io = new Server(server);
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected, game is starting');
  isWhite = Math.random() > 0 ? true : false
  console.log(`isWhite? ${isWhite}`)
  const bot = new BotPlayer(1320)
  const human = new HumanPlayer(socket)
  const game = isWhite? new Game(human,bot) : new Game(bot,human)
  game.startGame();

  socket.on('disconnect', () => {
    console.log('user disconnected');
    //add resign 
  });

});


server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});