const logger = require('../utils/logger')

const requests = function (req, res, next) {
  logger.trace(`Incoming request - ${req.method} ${req.url}`)
  res.on('finish', () => {
    try {
      logger.trace(
        `Finish request - ${req.method} ${req.url}. Returned status code - ${res.statusCode}`
      )
    } catch (error) {
      logger.error("couldn't log response")
    }
  })
  next()
}

module.exports = {
  logHttpRequests: requests,
}
