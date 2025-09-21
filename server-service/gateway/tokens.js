const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const store = require('../state/MongoActiveGamesStore')
const logger = require('../utils/logger')
const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require('@aws-sdk/client-secrets-manager')

const REGION = process.env.AWS_REGION || 'us-east-1'
const SECRET_ID = process.env.SECRET_ID || 'resume'
const secret_name = 'resume'

const sm = new SecretsManagerClient({ region: REGION })

let cache = { value: null, expiresAt: 0 }
const CACHE_TTL_MS = 15 * 60 * 1000
const secret = getSecret()
async function getSecret() {
  const now = Date.now()
  if (cache.value && now < cache.expiresAt) return cache.value

  const resp = await sm.send(new GetSecretValueCommand({ SecretId: SECRET_ID }))
  const raw =
    resp.SecretString ?? Buffer.from(resp.SecretBinary).toString('utf8')

  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch {
    parsed = { value: raw }
  }

  cache = { value: parsed, expiresAt: now + CACHE_TTL_MS }
  return parsed
}

function verifyResumeToken(token) {
  return jwt.verify(token, secret)
}

function newSeatSession({ gameId, userIdOrBot, color }) {
  const sessionId = uuidv4()
  const jti = uuidv4()

  const claims = { gameId, userId: userIdOrBot, color, sessionId, jti }
  const token = jwt.sign(claims, secret, {
    algorithm: 'HS256',
    expiresIn: '15m',
  })
  return { sessionId, jti, token }
}

function signWith({ gameId, userId, color, sessionId, jti }) {
  return jwt.sign({ gameId, userId, color, sessionId, jti }, secret, {
    algorithm: 'HS256',
    expiresIn: '15m',
  })
}

async function rotateToken({ gameId, color, userId }) {
  await store.update(gameId, { [`session.${color}.jti`]: uuidv4() })

  logger.info(`Rotating token for game ${gameId} and color ${color}`)
  return generateToken(gameId, userId)
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
