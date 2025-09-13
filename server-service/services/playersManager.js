const BotPlayer = require('../players/BotPlayer')
const HumanPlayer = require('../players/HumanPlayer')
const { registerToGame } = require('./gameManager')
const logger = require('../utils/logger')
function registerAsPlayer(username, userId, elo, socket, gameId) {
  logger.info(
    `registerAsPlayer:: Registering player ${username} to game ${gameId}`
  )
  let player = new HumanPlayer(socket, {
    username: username,
    userId: userId,
    elo: elo,
  })
  registerToGame(player, gameId)
}

function createBotToGame(elo, gameId) {
  let botPlayer = new BotPlayer(elo)
  registerToGame(botPlayer, gameId)
}

module.exports = {
  registerAsPlayer,
  createBotToGame,
}
