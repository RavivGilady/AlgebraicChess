const ActiveGames = require('../state/MongoActiveGamesStore');
/**
 * Check if a given seat (white/black) in a game is a bot.
 * Uses the ActiveGames snapshot in Mongo.
 */
async function isBotSeat(gameId, color) {
  const row = await ActiveGames.get(gameId);
  if (!row) return false;
  return row.players[color]?.type === 'bot';
}

module.exports = { isBotSeat };