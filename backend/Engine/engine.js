const { Chess } = require('chess.js')
const runStockfish = require('../stockfish.js')
class Engine {
    
    constructor(whitePlayer,BlackPlayer) {
      this.chess = new Chess();
      this.turn = 'white';
      this.whitePlayer = whitePlayer;
      this.elo = 1320;
    }
    printBoard(){
        console.log(this.chess.ascii())
    }
    userMove(userMove){
        this.chess.move(userMove)

    }

   
    async engineMove(){
        
        var move = runStockfish(this.elo,this.chess.fen())
        return move.then(uciMove => {
              const move = this.chess.move({
    from: uciMove.slice(0, 2),
    to: uciMove.slice(2, 4),
    promotion: uciMove[4] // if there's a promotion, it's the 5th character in UCI
  });

  // If the move is legal, return the algebraic notation
  if (move) {
     return move.san; // Standard Algebraic Notation (SAN)
  } else {
    throw new Error('Illegal move');
  }
         })
    }

    setElo(elo){
        if(isValidNumber(elo)){
            this.elo = elo;
        }
    }
    isValidNumber(input) {
        const num = Number(input);
    
        if (isNaN(num)) {
            return false;
        }
    
        return num >= 1320 && num <= 3000;
    }

    printAvailableMoves(){
        console.log(this.chess.moves())
    }
    isMoveLeagal(move){

        return this.chess.moves().includes(move)
    }
    isGameOver(){
        return this.chess.isGameOver();
    }
    getGameOverReason(){
        if(!this.isGameOver()){
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
    }

    isCheckmate(){
        return this.chess.isCheckmate();
    }
    
}

    module.exports = Engine;
