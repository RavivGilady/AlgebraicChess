const mongoose = require('mongoose')

const PlayerSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['human', 'bot'], required: true },
    userId: {
      type: String,
      required: function () {
        return this.type === 'human'
      },
    },

    elo: {
      type: Number,
      required: true,
      min: 0,
    },
    username: { type: String, required: true },
  },
  { _id: false, minimize: true }
)

const gameHistorySchema = new mongoose.Schema({
  _id: { type: String, required: true }, // use gameId

  white: { type: PlayerSchema, required: true },
  black: { type: PlayerSchema, required: true },

  winner: {
    type: String,
    enum: ['white', 'black', 'draw', null],
    default: null,
  },

  status: {
    type: String,
    enum: [
      'active',
      'checkmate',
      'draw',
      'resign',
      'timeout',
      'abandoned',
      'gameOver',
    ],
    default: 'active',
    index: true,
  },

  lastActivityAt: { type: Date, default: () => new Date(), index: true },
  expiresAt: { type: Date, index: true }, // null/absent means no TTL sweep

  snapshot: {
    moves: { type: [String], default: [] }, // ← safer
    fen: { type: String, required: true },
    turn: { type: String, enum: ['w', 'b'], required: true },
  },

  version: { type: Number, default: 0 },
})

gameHistorySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

gameHistorySchema.index({ 'white.userId': 1, status: 1, lastActivityAt: -1 })
gameHistorySchema.index({ 'black.userId': 1, status: 1, lastActivityAt: -1 })
module.exports = mongoose.model('GameHistory', gameHistorySchema)
