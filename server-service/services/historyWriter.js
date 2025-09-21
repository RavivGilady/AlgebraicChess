const ActiveGames = require('../state/MongoActiveGamesStore')
const GameHistory = require('../models/GameHistory')

async function write(gameId) {
  const row = await ActiveGames.get(gameId)
  if (!row) return

  // snapshot into history
  await GameHistory.create({
    gameId: row._id,
    players: row.players,
    moves: row.moveList,
    winner: row.winner,
    startedAt: row.createdAt,
    endedAt: new Date(),
  })

  await ActiveGames.delete(gameId)
}

module.exports = { write }
