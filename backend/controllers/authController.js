const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const registerUser = async (req, res) => {
    const { username, password } = req.body;

    logger.trace(`user tried registering: ${JSON.stringify({ username, password })}`)
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        logger.error(`Error registering a user: ${error}`)
        res.status(500).json({ message: 'Server error' });
    }
};

// Controller for user login
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare the password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
            expiresIn: '1h'
        });

        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const loginGuest = (req, res) => {
    const guestUsername = generateGuestUsername();
    logger.info(`created guest account ${guestUsername}`);
    const token = jwt.sign({username: guestUsername }, JWT_SECRET, {
        expiresIn: '1h'
    });

    res.json({ message: 'Login successful as a guest', token });
}

function generateGuestUsername() {
    const digits = '0123456789'.split('');
    let result = '';

    // Shuffle digits and take the first 9
    for (let i = 0; i < 9; i++) {
        const randIndex = Math.floor(Math.random() * digits.length);
        result += digits[randIndex];
    }

    return 'guest' + result;
}
module.exports = { registerUser, loginUser, loginGuest };
