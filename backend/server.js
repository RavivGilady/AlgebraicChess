require('dotenv').config();
const Game = require('./Game/game');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { connectDb } = require('./config/db');
const { Server } = require("socket.io");
const BotPlayer = require('./players/BotPlayer');
const HumanPlayer = require('./players/HumanPlayer');
const loggingMiddleware = require('./middlewares/loggerMiddleware')
const io = new Server(server);
const PORT = process.env.PORT || 5000;
const authRoutes = require('./routes/auth')
const gameRoutes = require('./routes/game')
const logger = require('./utils/logger')


const cors = require('cors');



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use(express.json());
app.use(loggingMiddleware.logHttpRequests)
app.use(cors({ origin: 'http://localhost:3000', methods: 'GET,POST,OPTIONS' }));

app.use('/auth',authRoutes)
app.use('/game',gameRoutes)

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
  logger.info(`listening on *:${PORT}`)
});

connectDb()
    .then(() => logger.info('Database connected successfully'))
    .catch(err => {
        logger.error(`Database connection failed:, ${err}`);
        process.exit(1);
    });
