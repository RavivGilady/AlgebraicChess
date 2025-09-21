const logger = require('../utils/logger')
const { v4: uuidv4 } = require('uuid')
const createGame = require('../services/createGame')
const { getResumeToken } = require('../gateway/tokens')
const gameAgainstBot = async function (botElo, userId, res) {
  const playerColor = Math.random() > 0.5 ? 'white' : 'black'
  const white =
    playerColor === 'white'
      ? { type: 'human', userId, elo: undefined }
      : { type: 'bot', elo: botElo }
  const black =
    playerColor === 'black'
      ? { type: 'human', userId, elo: undefined }
      : { type: 'bot', elo: botElo }
  const newGameId = uuidv4()
  const { whiteResumeToken, blackResumeToken } = await createGame({
    gameId: newGameId,
    white,
    black,
  })
  let resumeToken =
    playerColor === 'white' ? whiteResumeToken : blackResumeToken
  res.send({
    gameId: newGameId,
    resumeToken,
    opponentElo: botElo,
  })
}
const getResumeTokenController = async function (req, res) {
  const { gameId, color } = req.params

  const token = await getResumeToken(gameId, req.userId)

  res.send({ token })
}
module.exports = {
  gameAgainstBot,
  gameAgainstHuman: () => startGame({ vs: 'human' }),
  getResumeTokenController,
}
