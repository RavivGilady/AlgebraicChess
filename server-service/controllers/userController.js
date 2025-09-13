const GameHistory = require('../models/GameHistory')
const logger = require('../utils/logger')

const getUserGames = async (req, res) => {
  try {
    const { userId } = req.params

    const games = await GameHistory.find({
      $or: [{ 'white.userId': userId }, { 'black.userId': userId }],
    })
      .sort({ lastActivityAt: -1 })
      .select('_id white black winner status lastActivityAt snapshot.version')

    logger.info(`Retrieved ${games.length} games for user ${userId}`)

    res.json({
      success: true,
      games: games,
    })
  } catch (error) {
    logger.error(
      `Error retrieving games for user ${req.params.userId}: ${error}`
    )
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving games',
    })
  }
}

module.exports = {
  getUserGames,
}
