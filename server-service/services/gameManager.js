const Game = require('../Game/game')
const logger = require('../utils/logger')
let activeGames = new Map()

const createGame = () => {
  let newGame = new Game()
  activeGames.set(newGame.gameId, newGame)
  return newGame.gameId
}
const registerToGame = (player, gameId) => {
  let game = activeGames.get(gameId)
  if (game) {
    game.addPlayer(player)
    if (game.areAllPlayersSet()) {
      game.startGame()
    }
  } else {
    logger.error(`Game with id '${gameId}' doesn't exists!`)
  }
}

module.exports = {
  createGame,
  registerToGame,
}
