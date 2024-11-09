// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    elo: { type: Number, default: 1200 },       
    gamesPlayed: { type: Number, default: 0 },  
    wins: { type: Number, default: 0 },         
    losses: { type: Number, default: 0 },       
    draws: { type: Number, default: 0 },        
    status: { type: String, enum: ['online', 'offline', 'in-game'], default: 'offline' },
});

module.exports = mongoose.model('User', userSchema);
