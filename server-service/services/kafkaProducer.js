const { Kafka } = require('kafkajs')
const logger = require('../utils/logger')

const kafka = new Kafka({
  clientId: 'game-server-producer',
  brokers: process.env.KAFKA_BROKERS
    ? process.env.KAFKA_BROKERS.split(',')
    : ['localhost:9092'],
})

const producer = kafka.producer()
let isConnected = false

async function connect() {
  if (!isConnected) {
    await producer.connect()
    isConnected = true
    logger.info('[KafkaProducer] Connected to Kafka')
  }
}

async function sendMoveRequest({ gameId, moveId, color, fen, elo }) {
  await connect()

  try {
    await producer.send({
      topic: 'bot.move.request',
      messages: [
        {
          key: `gameId:${gameId}:moveId:${moveId}`,
          value: JSON.stringify({ gameId, moveId, color, fen, elo }),
        },
      ],
    })
    logger.info(
      `[KafkaProducer] Sent move request for game ${gameId}, move ${moveId}`
    )
  } catch (error) {
    logger.error('[KafkaProducer] Failed to send move request:', error.message)
    throw error
  }
}

async function disconnect() {
  if (isConnected) {
    await producer.disconnect()
    isConnected = false
    logger.info('[KafkaProducer] Disconnected from Kafka')
  }
}

module.exports = {
  sendMoveRequest,
  connect,
  disconnect,
}
