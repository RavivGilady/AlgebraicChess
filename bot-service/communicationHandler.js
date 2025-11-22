const { startConsumer } = require('./kafka/consumer')
const runStockfish = require('./stockfish/stockfish')
const express = require('express')


const startCommunicationHandler = () => {
   //read NODE_ENV and if it is production, use the production kafka broker
   const isProduction = process.env.NODE_ENV === 'production' ? true : false;
   console.log('isProduction', isProduction)
   if(isProduction) {
    startConsumer()
    .then(() => console.log('Bot service is listening for move requests'))
    .catch((err) => {
      console.error('Failed to start bot service:', err.message)
      process.exit(1)
    })
     } else {
      const messageQueueUrl = process.env.DEV_MESSAGE_QUEUE_URL || 'http://localhost:9092'
      subscribeToDevMessageQueue(messageQueueUrl)
      .then(() => console.log('Bot service is listening for move requests'))
      .catch((err) => {
        console.error('Failed to start bot service:', err.message)
        process.exit(1)
      })
          const app = createConsumerEndpoint(messageQueueUrl)
          const PORT = process.env.PORT || 3000 
          app.listen(PORT, () => {
            console.log(`Consumer endpoint is listening on port ${PORT}`)
          })
    }
}

const subscribeToDevMessageQueue = async (messageQueueUrl) => {
    const PORT = process.env.PORT || 3000 
  //post to /subscribe with the topic and url
  const response = await fetch(`${messageQueueUrl}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic: 'bot.move.request', url: `http://localhost:${PORT}/bot.move.request` })
  })
  if (!response.ok) {
    throw new Error('Failed to subscribe to dev message queue')
  }
  
}

const createConsumerEndpoint = (messageQueueUrl) => {
  const express = require('express')
  const app = express()
  app.use(express.json())
  app.post('/bot.move.request', async (req, res) => {
    const { gameId, moveId, color, fen, elo } = req.body

    const move = await runStockfish(elo, fen)
    const response = await fetch(`${messageQueueUrl}/publish/bot.move.result`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId, moveId, color, move })
    })
    if (!response.ok) {
      throw new Error('Failed to send move result to message queue')
    }
    res.json({ success: true })
  })
  return app
}

module.exports = { startCommunicationHandler, createConsumerEndpoint }
