const mongoose = require('mongoose')

const PlayerSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['human', 'bot'], required: true },
    userId: { type: String },
    elo: { type: Number },
  },
  { _id: false }
)

const GameHistorySchema = new mongoose.Schema({
  gameId: { type: String, required: true, index: true, unique: true },

  players: {
    white: { type: PlayerSchema, required: true },
    black: { type: PlayerSchema, required: true },
  },

  moves: { type: [String], required: true }, // SAN or LAN, whatever you store
  winner: {
    type: String,
    enum: ['white', 'black', 'draw', null],
    default: null,
  },

  startedAt: { type: Date, required: true },
  endedAt: { type: Date, required: true },

  createdAt: { type: Date, default: Date.now },
})

// Optional: indexes for analytics
GameHistorySchema.index({ 'players.userId': 1 })
GameHistorySchema.index({ endedAt: -1 })

module.exports = mongoose.model('GameHistory', GameHistorySchema)
