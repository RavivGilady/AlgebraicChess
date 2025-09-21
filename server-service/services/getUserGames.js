const store = require('../state/MongoActiveGamesStore')
const User = require('../models/User')
module.exports = async function getFilteredUserGames(userId) {
  const activeGames = await store.activeGamesForUser(userId)
  activeGames.forEach(async (game) => {
    let opponent =
      game.players.white.userId === userId
        ? game.players.black
        : game.players.white
    opponent.userId = undefined
    opponent.color = game.players.white.userId === userId ? 'black' : 'white'

    if (opponent.type === 'human') {
      const opponentUser = await User.findById(opponent.userId).select(
        'username'
      )
      opponent.username = opponentUser.username
      opponent.elo = opponentUser.elo
    }
    game.players = undefined
    game.opponent = opponent
  })
  return activeGames
}
