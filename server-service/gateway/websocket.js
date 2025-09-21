const { Server } = require('socket.io')
const { verifyResumeToken, rotateToken } = require('./tokens')
const ActiveGames = require('../state/MongoActiveGamesStore')
const logger = require('../utils/logger')
const { loadGame } = require('../services/gameLoaderFromDBtoMemory')
const gatewayService = require('../services/gatewayService')
let io
function room(gameId) {
  return `game:${gameId}`
}
function seatRoom(gameId, color) {
  return `game:${gameId}:seat:${color}`
}
module.exports = function createGateway(httpServer) {
  io = new Server({
    cors: {
      origin: 'https://algebric-chess.vercel.app||http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  })
  io.attach(httpServer)

  gatewayService.setIO(io)
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.resumeToken
      const payload = verifyResumeToken(token)
      const row = await ActiveGames.get(payload.gameId)
      if (!row) return next(new Error('GAME_NOT_FOUND'))
      if (
        row.session[payload.color].jti !== payload.jti ||
        row.session[payload.color].sessionId !== payload.sessionId
      )
        return next(new Error('TOKEN_MISMATCH'))
      socket.data = {
        gameId: payload.gameId,
        color: payload.color,
        userId: payload.userId,
      }

      next()
    } catch (e) {
      logger.error(`bad token: ${e.message}`)
      next(new Error('BAD_TOKEN'))
    }
  })

  io.on('connection', async (socket) => {
    logger.info(
      `User ${socket.data.userId} connected to game ${socket.data.gameId} and color ${socket.data.color}`
    )
    const { gameId, color } = socket.data
    socket.join(room(gameId))
    socket.join(seatRoom(gameId, color))
  
    const game = await loadGame(gameId)
    socket.emit('stateSync', {
      fen: game.getFen(),
      turn: game.currentPlayer,
      moveList: game.getMoveList(),
      turnId: game.currentMoveId,
    })
    const newToken = await rotateToken({
      gameId,
      color,
      userId: socket.data.userId,
    })
    socket.emit('resumeTokenRotated', { resumeToken: newToken })

    socket.on('makeMove', async ({ turnId, move }) => {
      const game = await loadGame(gameId)
      game.submitMove({ by: color, turnId, move })
    })
  })
}

module.exports.broadcast = (gameId, event, payload) => {
  io.to(room(gameId)).emit(event, payload)
}

module.exports.sendSeat = (gameId, color, event, payload) => {
  io.to(seatRoom(gameId, color)).emit(event, payload)
}
