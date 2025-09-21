require('dotenv').config()
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { connectDb } = require('./config/db')
const loggingMiddleware = require('./middlewares/loggerMiddleware')
const { startBotMovesConsumer } = require('./services/kafkaConsumer')

const PORT = process.env.PORT || 5000
const authRoutes = require('./routes/authRoutes')
const gameRoutes = require('./routes/gameRoutes')
const userRoutes = require('./routes/userRoutes')
const logger = require('./utils/logger')
const createGateway = require('./gateway/websocket')
const cors = require('cors')

app.use(express.json())
app.use(loggingMiddleware.logHttpRequests)
app.use(
  cors({
    origin: [
      'http://localhost:5174',
      'http://localhost:5173',
      'https://algebric-chess.vercel.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)
app.use('/auth', authRoutes)
app.use('/games', gameRoutes)
app.use('/user', userRoutes)

createGateway(server)

server.listen(PORT, '0.0.0.0', () => {
  logger.info(`listening on *:${PORT}`)
})

connectDb()
  .then(() => logger.info('Database connected successfully!!'))

  .catch((err) => {
    logger.error(`Database connection failed:, ${err}`)
    process.exit(1)
  })

startBotMovesConsumer()
  .then(() => logger.info('BotPlayManager is ready'))
  .catch((err) => {
    logger.error('BotPlayManager startup failed:', err.message)
    process.exit(1)
  })
