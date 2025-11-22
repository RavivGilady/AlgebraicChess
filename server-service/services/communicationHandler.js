const { startBotMovesConsumer } = require('./kafkaConsumer')
const { sendMoveRequestViaKafka } = require('./kafkaProducer')
const { loadGame } = require('./gameLoaderFromDBtoMemory')
const logger = require('../utils/logger')

const isProduction = process.env.NODE_ENV === 'production'
const messageQueueUrl =process.env.DEV_MESSAGE_QUEUE_URL || 'http://localhost:9092'

const startCommunicationHandler = (app, PORT) => {
  logger.info(`Starting communication handler in ${isProduction ? 'production' : 'development'} mode`)

  if (false) {
    startBotMovesConsumer()
      .then(() => logger.info('Bot moves consumer started (Kafka)'))
      .catch((err) => {
        logger.error('Failed to start bot moves consumer:', err.message)
        process.exit(1)
      })
  } else {      
    subscribeToDevMessageQueue(PORT)
      .then(() => logger.info('Subscribed to dev message queue'))
      .catch((err) => {
        logger.error('Failed to subscribe to dev message queue:', err.message)
        process.exit(1)
      })
    
    createConsumerEndpoint(app, PORT )
  }
}

const subscribeToDevMessageQueue = async (port) => {
  const response = await fetch(`${messageQueueUrl}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      topic: 'bot.move.result', 
      url: `http://localhost:${port}/bot.move.result` 
    })
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to subscribe to dev message queue: ${errorText}`)
  }
}

const createConsumerEndpoint = (app) => {
  app.post('/bot.move.result', async (req, res) => {
    try {
      const { gameId, moveId, color, move } = req.body
      
      logger.info(
        `[DevMessageQueue] Received bot move for game ${gameId}, move ${moveId}`
      )

      const game = await loadGame(gameId)
      game.submitMove({ by: color, turnId: moveId, move })
      
      res.json({ success: true })
    } catch (err) {
      logger.error('[DevMessageQueue] Failed to handle message:', err.message)
      res.status(500).json({ error: err.message })
    }
  })
  
  logger.info('Bot move result consumer endpoint registered at /bot.move.result')
}

const sendMoveRequest = async ({ gameId, moveId, color, fen, elo }) => {
  if (isProduction) {
    // Use Kafka producer in production
    await kafkaProducer.sendMoveRequestViaKafka({ gameId, moveId, color, fen, elo })
  } else {
    // Use dev message queue in development
    
    const response = await fetch(`${messageQueueUrl}/publish/bot.move.request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId, moveId, color, fen, elo })
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to publish move request to dev message queue: ${errorText}`)
    }
    
    logger.info(
      `[DevMessageQueue] Sent move request for game ${gameId}, move ${moveId}`
    )
  }
}

module.exports = { startCommunicationHandler, sendMoveRequest }

