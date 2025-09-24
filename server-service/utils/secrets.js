// config.js
const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require('@aws-sdk/client-secrets-manager')
const dotenv = require('dotenv')
const logger = require('./logger')
let cache

async function loadConfig() {
  if (cache) return cache

  if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
    cache = {
      RESUME_JWT_SECRET: process.env.RESUME_JWT_SECRET,
    }
    logger.info('Loaded config from .env')
    return cache
  }

  const region = process.env.AWS_REGION || 'us-east-1'
  const secretId = process.env.SECRET_ID || 'resume'

  const sm = new SecretsManagerClient({ region })
  const resp = await sm.send(new GetSecretValueCommand({ SecretId: secretId }))
  cache = JSON.parse(resp.SecretString)
  logger.info(`temp: secret resume is: ${JSON.stringify(cache)}`)

  return cache
}

module.exports = { loadConfig }
