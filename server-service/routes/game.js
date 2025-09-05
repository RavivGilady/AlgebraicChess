const express = require('express')
const {
  gameAgainstBot,
  gameAgainstHuman,
} = require('../controllers/gameController')
const { verifyToken } = require('../middlewares/authMiddleware')

const router = express.Router()
router.use(verifyToken)
router.get('/startGameBot', (req, res) => gameAgainstBot(req.query.elo, res))
router.get('/startGameHuman', gameAgainstHuman)

module.exports = router
