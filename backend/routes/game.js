const express = require('express');
const {gameAgainstBot,gameAgainstHuman } = require('../controllers/gameController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();
router.use(verifyToken)
router.get('/startGameBot', gameAgainstBot);
router.get('/startGameHuman', gameAgainstHuman);

module.exports = router;