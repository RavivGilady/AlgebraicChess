const EventEmitter = require('events')
const { Chess } = require('chess.js')
const { v4: uuidv4 } = require('uuid')
const logger = require('../utils/logger')
class Game extends EventEmitter {
  constructor({ gameId }) {
    super()
    this.chess = new Chess()
    this.currentPlayer = 'white'
    this.status = 'active'
    this.currentMoveId = 1
    logger.info(`GameObject constructor: ${gameId}`)
    this.gameId = gameId
    this.winner = undefined
  }

  setState({ currentPlayer, status, currentMoveId, winner, moveList, fen }) {
    this.chess = new Chess()
    moveList.map((move) => this.chess.move(move))

    if (
      (fen === 'startpos' && moveList.length > 0) ||
      (fen !== 'startpos' && this.chess.fen() !== fen)
    ) {
      throw new Error(`Invalid move list: ${moveList}and fen is ${fen}`)
    }
    this.currentPlayer = currentPlayer
    this.status = status
    this.currentMoveId = currentMoveId
    this.winner = winner
  }

  isGameOver() {
    return this.chess.isGameOver()
  }
  isCheckmate() {
    return this.chess.isCheckmate()
  }

  isStalemate() {
    return this.chess.isCheckmate()
  }

  swapTurn() {
    this.currentMoveId++
    this.currentPlayer = this.currentPlayer == 'white' ? 'black' : 'white'
  }
  submitMove({ by, turnId, move }) {
    if (this.status !== 'active') return
    if (by !== this.currentPlayer || turnId !== this.currentMoveId) return

    let moveResult = null
    try {
      moveResult = this.performMove(move)
    } catch (error) {
      this.getNewMove(move)
      return
    }

    this.notifyMove(moveResult)
    if (this.isGameOver()) {
      this.endGame()
    } else {
      this.swapTurn()
      this.requestMove()
    }
  }

  notifyMove(move) {
    this.emit('moveMade', {
      gameId: this.gameId,
      fenAfter: this.getFen(),
      by: this.currentPlayer,
      move: move,
      turnId: this.currentMoveId,
    })
  }
  endGame() {
    this.status = 'gameOver'
    this.winner = this.isCheckmate() ? this.currentPlayer : null

    this.emit('gameOver', {
      gameId: this.gameId,
      result: winner,
      son: 'checkmate',
    })
  }
  getNewMove(move) {
    this.emit('badMove', move)
    this.requestMove()
  }
  requestMove() {
    this.emit('turnStarted', {
      gameId: this.gameId,
      color: this.currentPlayer,
      fen: this.chess.fen(),
      turnId: this.currentMoveId,
    })
  }

  isUciMove(move) {
    return /^[a-h][1-8][a-h][1-8].?/.test(move)
  }
  performMove(move) {
    return this.isUciMove(move)
      ? this.chess.move({
          from: move.slice(0, 2),
          to: move.slice(2, 4),
          ...(move.length > 4 ? { promotion: move[4] } : {}), // Check length before accessing move[4]
        }).san
      : this.chess.move(move).san
  }

  resign(by) {
    if (this.status !== 'active') return
    const winner = by === 'white' ? 'black' : 'white'
    this.status = 'gameOver'
    this.emit('gameOver', {
      gameId: this.gameId,
      result: winner,
      reason: 'resign',
    })
  }
  startGame() {
    this.requestMove()
  }
  getMoveList() {
    return this.chess.history()
  }
  getFen() {
    return this.chess.fen()
  }
}

module.exports = Game
