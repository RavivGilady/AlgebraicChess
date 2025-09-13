const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')

// Middleware to verify JWT token
exports.verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]
  if (!token) {
    logger.error(`Unauthorized request ${req.method} ${req.url}`)
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.id
    next()
  } catch (error) {
    logger.error(`Error was thrown to verify token:${error}`)
    return res.status(401).json({ error: 'Unauthorized' })
  }
}
exports.mustOwnResource = (req, res, next) => {
  if (req.user?.role === 'admin' || req.userId === req.params.userId)
    return next()
  next({ status: 403, message: 'Forbidden' })
}
