const Engine = require('./Engine/engine');

// const engine = new Engine();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  const engine = new Engine();
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('chat message', (move) => {
   if(engine.isMoveLeagal(move)){
    engine.userMove(move)
    socket.emit("legal move",move)
    if(engine.isGameOver()){
      if(engine.isCheckmate())
        socket.emit("checkmate player 1")
      else
        socket.emit("draw",engine.getGameOverReason())
    }
    engine.engineMove().then(move => { 
      socket.emit("engine move",move)
      console.log(`Sent move to client: ${move}`)
      if(engine.isGameOver()){
        if(engine.isCheckmate())
          socket.emit("checkmate player 2")
        else
          socket.emit("draw",engine.getGameOverReason())
      }
    });
    
   }
   else{
    engine.printAvailableMoves();
    socket.emit("invalid move")
   }
  });
  socket.on('set elo', (move) => {
    engine.setElo(move);
    })
});



server.listen(3000, () => {
  console.log('listening on *:3000');
});