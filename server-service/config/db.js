const mongoose = require('mongoose');

const connectDb = async () => {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/chess_app';
    await mongoose.connect(MONGO_URI);
};

module.exports = { connectDb };
