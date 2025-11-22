const { sendMoveRequest } = require('./communicationHandler')

async function onTurnStarted(gameId, fen, turnId, color, elo) {
  await sendMoveRequest({
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
