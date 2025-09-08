const EventEmitter = require('events')
const { Chess } = require('chess.js')
const { v4: uuidv4 } = require('uuid')
const logger = require('../utils/logger')
class Game extends EventEmitter {
  constructor() {
    super()
    this.chess = new Chess()
    this.whitePlayer = null
    this.blackPlayer = null
    this.currentPlayer = null
    this.currentMoveId = uuidv4()
    this.gameId = uuidv4()
    this.winner = undefined
    this.gameOver = false
  }
  addPlayer(player) {
    if (this.whitePlayer == null && this.blackPlayer == null) {
      Math.random() > 0.5
        ? (this.whitePlayer = player)
        : (this.blackPlayer = player)
    } else if (this.whitePlayer == null) {
      this.whitePlayer = player
    } else if (this.blackPlayer == null) {
      this.blackPlayer = player
    } else {
      logger.error(`Game ${this.gameId} already has two players!`)
      return
    }
    logger.info(
      `Player ${JSON.stringify(player.getPlayerDetails())} added to game ${this.gameId} as ${this.whitePlayer == player ? 'white' : 'black'}`
    )
  }
  areAllPlayersSet() {
    return this.whitePlayer != null && this.blackPlayer != null
  }
  startGame() {
    this.whitePlayer.setOnMoveCallback((data) =>
      this.makeMove(this.whitePlayer, { move: data.move, moveId: data.moveId })
    )
    this.whitePlayer.setDisconnectCallback(() => this.disconnectPlayer())
    this.whitePlayer.setColor('white')
    this.blackPlayer.setOnMoveCallback((data) =>
      this.makeMove(this.blackPlayer, { move: data.move, moveId: data.moveId })
    )
    this.blackPlayer.setDisconnectCallback(() => this.disconnectPlayer())
    this.blackPlayer.setColor('black')
    this.currentPlayer = this.whitePlayer
    this.currentPlayer.requestMove(this.currentMoveId)
  }
  printBoard() {
    console.log(this.chess.ascii())
  }

  printAvailableMoves() {
    console.log(this.chess.moves())
  }
  isMoveLeagal(move) {
    console.log(`moves available: ${this.chess.moves()}`)
    return this.chess.moves().includes(move)
  }
  isGameOver() {
    return this.chess.isGameOver()
  }
  isCheckmate() {
    return this.chess.isCheckmate()
  }
  getGameOverReason() {
    if (!this.isGameOver()) {
      throw new Error('Game not over yet!')
    }
    if (this.chess.isThreefoldRepetition()) return 'threeFold'
    if (this.chess.isDraw()) return 'draw'
    if (this.chess.isInsufficientMaterial()) return 'insufficientMaterial'
    if (this.chess.isStalemate()) return 'stalemate'
    if (this.chess.isCheckmate()) {
      return 'checkmate'
    }
  }

  isCheckmate() {
    return this.chess.isCheckmate()
  }

  notifyGameResult() {
    this.whitePlayer.gameOver(this.getGameOverReason(), this.winner)
    this.blackPlayer.gameOver(this.getGameOverReason(), this.winner)
  }

  swapTurn() {
    this.currentPlayer =
      this.currentPlayer == this.whitePlayer
        ? this.blackPlayer
        : this.whitePlayer
  }
  makeMove(player, moveDetails) {
    console.log(JSON.stringify(moveDetails))
    let move = null
    if (
      player === this.currentPlayer &&
      this.currentMoveId === moveDetails.moveId
    ) {
      try {
        move = this.performMove(moveDetails.move)
      } catch (error) {
        this.getNewMove(moveDetails.move)
        return
      }

      this.notifyMove(move)
      if (this.isGameOver()) {
        this.endGame()
      } else {
        this.swapTurn()
        this.requestMove()
      }
    }
  }
  notifyMove(move) {
    let playerColor = this.currentPlayer == this.whitePlayer ? 'white' : 'black'
    this.whitePlayer.notifyMove({ color: playerColor, move: move })
    this.blackPlayer.notifyMove({ color: playerColor, move: move })
  }
  endGame() {
    this.gameOver = true
    this.winner = this.isCheckmate() ? this.currentPlayer : null
    this.notifyGameResult()
  }
  getNewMove(move) {
    console.log(`move ${move} is bad , requesting new`)
    this.currentPlayer.notifyBadMove(move)
    this.requestMove()
  }
  requestMove() {
    this.currentMoveId = uuidv4()
    this.currentPlayer.requestMove(this.currentMoveId)
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
  disconnectPlayer() {
    if (this.areBothPlayersDisconnected()) {
      this.emit('allPlayersDisconnected')
    }
  }
  areBothPlayersDisconnected() {
    return (
      this.whitePlayer.getIsDisconnected() &&
      this.blackPlayer.getIsDisconnected()
    )
  }
  getGameDetailsForPersistence() {
    const whitePlayerDetails = this.whitePlayer.getPlayerDetails()
    const blackPlayerDetails = this.blackPlayer.getPlayerDetails()
    logger.info(`whitePlayerDetails: ${JSON.stringify(whitePlayerDetails)}`)
    logger.info(`blackPlayerDetails: ${JSON.stringify(blackPlayerDetails)}`)
    const game = {
      _id: this.gameId,
      white: {
        type: whitePlayerDetails.type,
        userId:
          whitePlayerDetails.type == 'human'
            ? whitePlayerDetails.userId
            : undefined,
        elo: whitePlayerDetails.elo,
      },
      black: {
        type: blackPlayerDetails.type,
        userId:
          blackPlayerDetails.type == 'human'
            ? blackPlayerDetails.userId
            : undefined,
        elo: blackPlayerDetails.elo,
      },
      winner: this.winner
        ? this.winner === this.whitePlayer
          ? 'white'
          : 'black'
        : null,
      status: this.gameOver ? 'gameOver' : 'active', // need to expand
      lastActivityAt: new Date(),
      version: 0,
      expiresAt: this.gameOver ? null : new Date(Date.now() + 86400000),
      snapshot: {
        moves: this.chess.history(),
        fen: this.chess.fen(),
        turn: this.chess.turn(),
      },
    }
    return game
  }
}

module.exports = Game
