const GameRegistry = require('../engine/GameRegistry')
const ActiveGames = require('../state/MongoActiveGamesStore')
const GameObject = require('../engine/GameObject')
const engineMeta = require('./engineMeta')
const { attachListeners } = require('./GameService')
const logger = require('../utils/logger')

async function loadGame(gameId) {
  let game = GameRegistry.get(gameId)
  logger.info(`Game ${gameId} found in registry: ${game ? 'true' : 'false'}`)
  if (!game) {
    logger.info(`Game ${gameId} not found in registry, loading from database`)
    const row = await ActiveGames.get(gameId)
    logger.info(`Game ${gameId} found in database`)
  game = new GameObject({ gameId })
    game.setState({
      currentPlayer: row.turn,
      status: row.status,
      currentMoveId: row.turnId,
      winner: row.winner,
      moveList: row.moveList,
      fen: row.fen,
    })
    engineMeta.setPlayers(game, {
      white: row.players.white,
      black: row.players.black,
    })
    GameRegistry.set(gameId, game)
    attachListeners(game)
  }
  return game
}
module.exports = { loadGame }
