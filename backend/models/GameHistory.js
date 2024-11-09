const mongoose = require('mongoose');

const gameHistorySchema = new mongoose.Schema({
    white: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the white player
    black: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the black player
    winner: { type: String, enum: ['white', 'black', 'draw'], required: true },   // 'white', 'black', or 'draw'
    moves: [{ type: String, required: true }], // Array of moves in standard chess notation
    timestamp: { type: Date, default: Date.now } // Timestamp of when the game was played
});

module.exports = mongoose.model('GameHistory', gameHistorySchema);
