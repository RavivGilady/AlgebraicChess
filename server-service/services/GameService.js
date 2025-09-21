const GameRegistry = require('../engine/GameRegistry')
const ActiveGames = require('../state/MongoActiveGamesStore')
const kafkaProducer = require('./kafkaProducer')
const logger = require('../utils/logger')
const engineMeta = require('./engineMeta')
const gatewayService = require('./gatewayService')
function attachListeners(game) {
  game.on('turnStarted', (evt) => {
    const player = engineMeta.getSeat(game, evt.color)
    if (engineMeta.getSeat(game, evt.color)['type'] === 'bot') {
      kafkaProducer.sendMoveRequest({
        gameId: evt.gameId,
        moveId: evt.turnId,
        color: evt.color,
        fen: evt.fen,
        elo: player.elo,
      })
    } else {
      gatewayService.sendSeat(evt.gameId, evt.color, 'yourTurn', evt)
    }
  })

  game.on('moveMade', async (evt) => {
    gatewayService.broadcast(evt.gameId, 'moveMade', evt)
    await ActiveGames.update(evt.gameId, {
      fen: evt.fenAfter,
      turn: evt.by === 'white' ? 'black' : 'white',
      turnId: evt.turnId + 1,
      moveList: game.getMoveList(),
    })
  })

  game.on('invalidMove', (evt) => {
    if (engineMeta.getSeat(evt.gameId, evt.color)['type'] === 'bot') {
      logger.error('Bot made invalid move', evt)
    } else {
      gatewayService.sendSeat(evt.gameId, evt.by, 'invalidMove', evt)
    }
  })

  game.on('gameOver', async (evt) => {
    gatewayService.broadcast(evt.gameId, 'gameOver', evt)
    await ActiveGames.setStatus(evt.gameId, 'finished')
    await historyWriter.write(evt.gameId)
    GameRegistry.del(evt.gameId)
  })
}

module.exports = { attachListeners }
