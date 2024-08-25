const Engine = require('./Engine/engine');

const engine = new Engine();
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
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('chat message', (msg) => {
   if(engine.isMoveLeagal(msg)){
    engine.move(msg)
    socket.emit("legal move",msg)
    engine.requestMove().then(move => { 
      socket.emit("engine move",move)
      console.log(`Sent move to client: ${move}`)
    });
    
   }
   else{
    engine.printAvailableMoves();
    socket.emit("invalid move")
   }
  });
  socket.on('set elo', (msg) => {
    engine.setElo(msg);
    })
});



server.listen(3000, () => {
  console.log('listening on *:3000');
});