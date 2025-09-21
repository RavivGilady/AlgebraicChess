const express = require('express')
const {
  gameAgainstBot,
  gameAgainstHuman,
  getResumeTokenController,
} = require('../controllers/gameController')
const { verifyToken } = require('../middlewares/authMiddleware')

const router = express.Router()
router.use(verifyToken)
router.get('/startGameBot', (req, res) =>
  gameAgainstBot(req.query.elo, req.userId, res)
)
router.get('/startGameHuman', gameAgainstHuman)
router.get('/:gameId/resumeToken', getResumeTokenController)
module.exports = router
