const { Kafka } = require('kafkajs')
const runStockfish = require('../stockfish/stockfish')
const { sendMoveResult } = require('./producer')
const logger = require('../utils/logger')

const kafka = new Kafka({
  clientId: 'bot-service',
  brokers: process.env.KAFKA_BROKERS
    ? process.env.KAFKA_BROKERS.split(',')
    : ['localhost:9092'],
})

const consumer = kafka.consumer({ groupId: 'stockfish-bots' })

exports.startConsumer = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic: 'bot.move.request', fromBeginning: false })

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        logger.info(
          `[BotService] Processing move request: ${JSON.stringify(JSON.parse(message.value))}`
        )

        const { gameId, moveId, color, fen, elo } = JSON.parse(message.value)
        //create a mock obejct: { gameId, moveId, color, fen, elo }, make attribute enclosed by quotes as a ready object


        const mockObject = { "gameId": "123", "moveId": "1", "color": "white", "fen": 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', "elo": 1000 }
        const move = await runStockfish(elo, fen)

        await sendMoveResult({ gameId, moveId, color, move })
      } catch (err) {
        logger.error('[BotService] Error processing move request:', err.message)
      }
    },
  })
}
