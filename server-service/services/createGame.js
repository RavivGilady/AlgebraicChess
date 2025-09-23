const ActiveGames = require('../state/MongoActiveGamesStore')
const GameRegistry = require('../engine/GameRegistry')
const GameObject = require('../engine/GameObject')
const { attachListeners } = require('./GameService')
const { newSeatSession } = require('../gateway/tokens')
const engineMeta = require('./engineMeta')
const logger = require('../utils/logger')
module.exports = async function createGame({ gameId, white, black }) {
  const wSess = await newSeatSession({
    gameId,
    userIdOrBot: white.userId ?? 'bot',
    color: 'white',
  })
  const bSess = await newSeatSession({
    gameId,
    userIdOrBot: black.userId ?? 'bot',
    color: 'black',
  })

  const row = {
    _id: gameId,
    status: 'active',
    players: { white, black },
    session: {
      white: {
        sessionId: wSess.sessionId,
        jti: wSess.jti,
        resumeDeadlineAt: null,
      },
      black: {
        sessionId: bSess.sessionId,
        jti: bSess.jti,
        resumeDeadlineAt: null,
      },
    },
    fen: 'startpos',
    turn: 'white',
    turnId: 1,
    away: { white: false, black: false },
  }
  await ActiveGames.upsert(row)
  logger.info(`Game ${row._id} created`)
  const game = new GameObject({ gameId })
  engineMeta.setPlayers(game, { white: white, black: black })

  GameRegistry.set(gameId, game)
  logger.info(`Game ${gameId} added to registry`)
  attachListeners(game)
  game.startGame()
  return {
    whiteResumeToken: wSess.token,
    blackResumeToken: bSess.token,
  }
}
