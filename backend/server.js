require('dotenv').config();
const Game = require('./Game/game');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { connectDb } = require('./config/db');
const loggingMiddleware = require('./middlewares/loggerMiddleware')

const PORT = process.env.PORT || 5000;
const authRoutes = require('./routes/auth')
const gameRoutes = require('./routes/game')
const logger = require('./utils/logger')
const { io } = require('./utils/socketsStore')

const cors = require('cors');


app.use(express.json());
app.use(loggingMiddleware.logHttpRequests)
app.use(cors({
  origin: ['http://localhost:3000', 'https://algebric-chess.vercel.app'], // include both dev & prod
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use('/auth', authRoutes)
app.use('/game', gameRoutes)

io.attach(server)



server.listen(PORT, '0.0.0.0', () => {
  logger.info(`listening on *:${PORT}`)
});

// connectDb()
//     .then(() => logger.info('Database connected successfully'))
//     .catch(err => {
//         logger.error(`Database connection failed:, ${err}`);
//         process.exit(1);
//     });

