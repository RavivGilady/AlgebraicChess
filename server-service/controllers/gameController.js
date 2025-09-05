const logger = require('../utils/logger')
const { createGame } = require('../services/gameManager')
const { createBotToGame } = require('../services/playersManager')

const gameAgainstBot = async function (botElo, res) {
  let newGameId = createGame()
  createBotToGame(botElo, newGameId)
  res.send({ gameId: newGameId })
}

module.exports = {
  gameAgainstBot,
  gameAgainstHuman: () => startGame({ vs: 'human' }),
}
