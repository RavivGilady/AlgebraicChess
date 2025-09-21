const { Kafka } = require('kafkajs')
const logger = require('../utils/logger')
const { loadGame } = require('./gameLoaderFromDBtoMemory')

const kafka = new Kafka({
  clientId: 'game-server-consumer',
  brokers: process.env.KAFKA_BROKERS
    ? process.env.KAFKA_BROKERS.split(',')
    : ['localhost:9092'],
})

let consumer = null

async function startBotMovesConsumer() {
  consumer = kafka.consumer({ groupId: 'bot-move-consumers' })

  await consumer.connect()
  await consumer.subscribe({ topic: 'bot.move.result', fromBeginning: false })

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const { gameId, moveId, color, move } = JSON.parse(
          message.value.toString()
        )
        logger.info(
          `[KafkaConsumer] Received bot move for game ${gameId}, move ${moveId}`
        )

        const game = await loadGame(gameId)
        game.submitMove({ by: color, turnId: moveId, move })
      } catch (err) {
        logger.error('[KafkaConsumer] Failed to handle message:', err.message)
      }
    },
  })

  logger.info('[KafkaConsumer] Bot moves consumer started')
}

async function stopBotMovesConsumer() {
  if (consumer) {
    await consumer.disconnect()
    consumer = null
    logger.info('[KafkaConsumer] Bot moves consumer stopped')
  }
}

module.exports = {
  startBotMovesConsumer,
  stopBotMovesConsumer,
}
