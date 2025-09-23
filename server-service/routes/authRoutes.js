const express = require('express')
const {
  registerUser,
  loginUser,
  loginGuest,
} = require('../controllers/authController')
const { rateLimit } = require('express-rate-limit')

const router = express.Router()
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests, please try again later.',
})

const limiterForGuest = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 10,
  message: 'Too many requests, please try again later.',
})

router.post('/register', limiter, registerUser)
router.post('/login', limiter, loginUser)
router.get('/loginAsGuest', limiterForGuest, loginGuest)

module.exports = router
