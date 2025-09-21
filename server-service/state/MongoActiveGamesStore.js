const ActiveGame = require('../models/ActiveGame')

class MongoActiveGamesStore {
  async get(gameId) {
    return ActiveGame.findById(gameId).lean().exec()
  }
  async upsert(row) {
    await ActiveGame.updateOne(
      { _id: row._id },
      { $set: row, $setOnInsert: { version: 0 } },
      { upsert: true }
    )
  }
  async update(gameId, patch, ifVersion) {
    const res = await ActiveGame.updateOne(
      {
        _id: gameId,
        ...(Number.isInteger(ifVersion) ? { version: ifVersion } : {}),
      },
      { $set: { ...patch, updatedAt: new Date() }, $inc: { version: 1 } }
    )
    return res.matchedCount === 1 && res.modifiedCount === 1
  }
  async setStatus(gameId, status) {
    await this.update(gameId, { status })
  }
  async activeRows() {
    return ActiveGame.find({ status: 'active' }).lean().exec()
  }
  async activeGamesForUser(userId) {
    return ActiveGame.find({
      $or: [
        { 'players.white.userId': userId },
        { 'players.black.userId': userId },
      ],
    })
      .where('status')
      .equals('active')
      .sort({ updatedAt: -1 })
      .select(
        '_id players.white players.black status moveList updatedAt version'
      )
      .lean()
      .exec()
  }
}

module.exports = new MongoActiveGamesStore()
