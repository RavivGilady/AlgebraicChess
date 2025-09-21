const express = require('express')
const { getUserGames } = require('../controllers/userController')
const {
  verifyToken,
  mustOwnResource,
} = require('../middlewares/authMiddleware')
const router = express.Router()

router.use(verifyToken)

router.get('/:userId/games', mustOwnResource, getUserGames)

module.exports = router
