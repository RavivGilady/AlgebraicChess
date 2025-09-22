const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const store = require('../state/MongoActiveGamesStore')
const logger = require('../utils/logger')
const { loadConfig } = require('../utils/secrets')

let RESUME_JWT_SECRET, JWT_SECRET

;(async () => {
  const config = await loadConfig()
  RESUME_JWT_SECRET = config.RESUME_JWT_SECRET
  JWT_SECRET = config.JWT_SECRET
})()
async function verifyResumeToken(token) {
  return jwt.verify(token, RESUME_JWT_SECRET)
}

async function newSeatSession({ gameId, userIdOrBot, color }) {
  const sessionId = uuidv4()
  const jti = uuidv4()

  const claims = { gameId, userId: userIdOrBot, color, sessionId, jti }
  const token = jwt.sign(claims, RESUME_JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: '15m',
  })
  return { sessionId, jti, token }
}

async function signWith({ gameId, userId, color, sessionId, jti }) {
  return jwt.sign(
    { gameId, userId, color, sessionId, jti },
    RESUME_JWT_SECRET,
    {
      algorithm: 'HS256',
      expiresIn: '15m',
    }
  )
}

async function rotateToken({ gameId, color, userId }) {
  await store.update(gameId, { [`session.${color}.jti`]: uuidv4() })

  logger.info(`Rotating token for game ${gameId} and color ${color}`)
  return await generateToken(gameId, userId)
}
async function generateToken(gameId, userId) {
  const row = await store.get(gameId)
  if (!row) {
    logger.error(`Game ${gameId} not found`)
    throw new Error('Game not found')
  }
  let color = calculateColor(row, userId)
  if (color) {
    const sessionId = row.session[color].sessionId
    return signWith({
      gameId,
      userId,
      color,
      sessionId,
      jti: row.session[color].jti,
    })
  } else {
    return null
  }
}
function calculateColor(row, userId) {
  return row.players.white.userId === userId
    ? 'white'
    : row.players.black.userId === userId
      ? 'black'
      : null
}
async function getResumeToken(gameId, userId) {
  return generateToken(gameId, userId)
}

module.exports = {
  verifyResumeToken,
  newSeatSession,
  rotateToken,
  getResumeToken,
}
