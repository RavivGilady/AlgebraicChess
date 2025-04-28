
const { Chess } = require('chess.js');
const runStockfish = require('../stockfish.js');
const Player = require('./Player.js');

function isValidNumber(input) {
    const num = Number(input);

    if (isNaN(num)) {
        return false;
    }

    return num >= 1320 && num <= 3000;
}
class BotPlayer extends Player {

    constructor(elo) {
        super();
        if (!isValidNumber(elo)) {
            throw new Error("elo must be between 1320 and 3000!");
        }
        this.elo = elo
        this.board = new Chess();
        this.onMove = null;
    }


    setOnMoveCallback(callback) {
        this.onMove = callback
    }
    requestMove(nextMoveId) {

        return runStockfish(this.elo, this.board.fen()).then((move) =>
            setTimeout(() => {
                this.onMove({"move":move,"moveId":nextMoveId})
            }, 0)
        )
    }
    
    notifyMove(move) {
        this.board.move(move.move)
    }
    notifyBadMove(move) {
        throw new Error("Engine gave bad move somehow");
    }
    getPlayerDetails(){
        return ({type: 'bot', elo:this.elo})
    }
}


module.exports = BotPlayer;
    

