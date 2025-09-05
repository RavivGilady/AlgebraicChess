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

        const { moveId, elo, fen } = JSON.parse(message.value)
        const move = await runStockfish(elo, fen)

        await sendMoveResult({ moveId, move })
      } catch (err) {
        logger.error('[BotService] Error processing move request:', err.message)
      }
    },
  })
}
