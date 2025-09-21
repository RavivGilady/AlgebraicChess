const mongoose = require('mongoose')

const Seat = new mongoose.Schema(
  {
    type: { type: String, enum: ['human', 'bot'], required: true },
    userId: { type: String },
    elo: { type: Number },
  },
  { _id: false }
)
const Session = new mongoose.Schema(
  {
    sessionId: { type: String, required: true },
    jti: { type: String, required: true },
    resumeDeadlineAt: { type: Date, default: null },
  },
  { _id: false }
)

const ActiveGameSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // gameId
    status: {
      type: String,
      enum: ['active', 'finished', 'aborted'],
      default: 'active',
    },
    players: {
      white: { type: Seat, required: true },
      black: { type: Seat, required: true },
    },
    session: {
      white: { type: Session, required: true },
      black: { type: Session, required: true },
    },
    fen: { type: String, required: true }, // snapshot (startpos or FEN)
    turn: { type: String, enum: ['white', 'black'], required: true },
    turnId: { type: Number, default: 1 },

    updatedAt: { type: Date, default: Date.now },
    version: { type: Number, default: 0 },
    moveList: { type: Array, default: [] },
  },
  { collection: 'active_games' }
)

ActiveGameSchema.index({ status: 1, updatedAt: -1 })

module.exports = mongoose.model('ActiveGame', ActiveGameSchema)
