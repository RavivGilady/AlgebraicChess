const express = require('express');
const { registerUser, loginUser, loginGuest } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/loginAsGuest', loginGuest);

module.exports = router;