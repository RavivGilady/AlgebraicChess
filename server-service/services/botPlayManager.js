// This file is deprecated - functionality moved to kafkaProducer.js and kafkaConsumer.js
// Keeping for backward compatibility during transition
const kafkaProducer = require('./kafkaProducer')

async function onTurnStarted(gameId, fen, turnId, color, elo) {
  await kafkaProducer.sendMoveRequest({
    gameId,
    moveId: turnId,
    color,
    fen,
    elo,
  })
}

module.exports = {
  onTurnStarted,
}
