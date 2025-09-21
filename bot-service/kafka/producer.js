const { Kafka } = require('kafkajs')
const logger = require('../utils/logger')

const kafka = new Kafka({
  clientId: 'bot-service',
  brokers: process.env.KAFKA_BROKERS
    ? process.env.KAFKA_BROKERS.split(',')
    : ['localhost:9092'],
})

const producer = kafka.producer()
let isConnected = false

exports.sendMoveResult = async ({ gameId, moveId, color, move }) => {
  if (!isConnected) {
    await producer.connect()
    isConnected = true
  }

  await producer.send({
    topic: 'bot.move.result',
    messages: [
      {
        key: `gameId:${gameId}:moveId:${moveId}`,
        value: JSON.stringify({ gameId, moveId, color, move }),
      },
    ],
  })
  logger.info(
    `[BotService] Move result sent for moveId: ${moveId}, move: ${JSON.stringify(move)}`
  )
}
