const getFilteredUserGames = require('../services/getUserGames')
const logger = require('../utils/logger')

const getUserGames = async (req, res) => {
  try {
    const { userId } = req.params

    const activeGames = await getFilteredUserGames(userId)

    logger.info(`Retrieved ${activeGames.length} games for user ${userId}`)

    res.json({
      success: true,
      games: activeGames,
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
