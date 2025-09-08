const Game = require('../Game/game')
const logger = require('../utils/logger')
let activeGames = new Map()
const GameHistory = require('../models/GameHistory')

const createGame = () => {
  let newGame = new Game()
  activeGames.set(newGame.gameId, newGame)
  newGame.on('allPlayersDisconnected', () => {
    logger.info(
      `Game with id '${newGame.gameId}' has all players disconnected, saving game to database`
    )
    const gameDetails = newGame.getGameDetailsForPersistence()
    saveGameToDatabase(gameDetails)
  })
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

const saveGameToDatabase = (gameDetails) => {
  try {
    GameHistory.create(gameDetails)
    logger.info(
      `Game with id '${gameDetails._id}' saved successfully to database`
    )
  } catch (error) {
    logger.error(`Error saving game ${gameDetails._id} to database: ${error}`)
  }
}
module.exports = {
  createGame,
  registerToGame,
}
