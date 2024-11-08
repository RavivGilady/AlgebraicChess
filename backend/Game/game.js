const { Chess } = require('chess.js')
const { v4: uuidv4 } = require('uuid');



class Game {

    constructor(whitePlayer, blackPlayer) {
        this.chess = new Chess();
        this.whitePlayer = whitePlayer;
        this.whitePlayer.setOnMoveCallback(data=>this.makeMove(this.whitePlayer,{"move": data.move,"moveId":data.moveId}))
        this.whitePlayer.setColor('white')

        this.blackPlayer = blackPlayer;
        this.blackPlayer.setOnMoveCallback(data=>this.makeMove(this.blackPlayer,{"move": data.move,"moveId":data.moveId}))
        this.blackPlayer.setColor('black')

        this.currentPlayer = whitePlayer
        this.currentMoveID = uuidv4();
    }
    startGame(){
        console.log(`move id for start ${this.currentMoveID}`)
        this.whitePlayer.requestMove(this.currentMoveID)
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
        return this.chess.isGameOver();
    }
    isCheckmate(){
        return this.chess.isCheckmate();

    }
    getGameOverReason() {
        if (!this.isGameOver()) {
            throw new Error("Game not over yet!");
        }
        if (this.chess.isThreefoldRepetition())
            return "threeFold"
        if (this.chess.isDraw())
            return "draw"
        if (this.chess.isInsufficientMaterial())
            return "insufficientMaterial"
        if (this.chess.isStalemate())
            return "stalemate"
        if (this.chess.isCheckmate()) {
            return "checkmate"
        }
    }

    isCheckmate() {
        return this.chess.isCheckmate();
    }

    notifyGameResult(winner) {
        this.whitePlayer.gameOver(this.getGameOverReason(), winner)
        this.blackPlayer.gameOver(this.getGameOverReason(), winner)
    }

    swapTurn() {
        this.currentPlayer = this.currentPlayer == this.whitePlayer ? this.blackPlayer : this.whitePlayer;
    }
    makeMove(player, moveDetails) {
        console.log(JSON.stringify(moveDetails))
        let move = null;
        if (player === this.currentPlayer && this.currentMoveID === moveDetails.moveId) {
            try{
            
            move = this.performMove(moveDetails.move); 
            
            }
            catch(error) {
                this.getNewMove(moveDetails.move)
                return;
            }

            this.notifyMove(move)
            if (this.isGameOver()) {
                endGame();
            }
            else {
                this.swapTurn()
                this.requestMove()
            }
            
        }

    }
    notifyMove(move) {
        let playerColor = this.currentPlayer == this.whitePlayer ? "white" : "black";
        this.whitePlayer.notifyMove({ "color": playerColor, "move": move })
        this.blackPlayer.notifyMove({ "color": playerColor, "move": move })
    }
    endGame(){
        winner = this.isCheckmate() ? this.currentPlayer : null;
        this.notifyGameResult(winner);
    }
    getNewMove(move) {
        console.log(`move ${move} is bad , requesting new`)
        this.currentPlayer.notifyBadMove(move);
        this.requestMove()
    }
    requestMove() {
        this.currentMoveID = uuidv4();
        this.currentPlayer.requestMove(this.currentMoveID)
    }

    isUciMove(move){
        return /^[a-h][1-8][a-h][1-8].?/.test(move);
    }
    performMove(move){
        return this.isUciMove(move) ? this.chess.move({
            from: move.slice(0, 2),
            to: move.slice(2, 4),
            ...(move.length > 4 ? { promotion: move[4] } : {})  // Check length before accessing move[4]
        }).san
        : this.chess.move(move).san
    }
}


module.exports = Game;
