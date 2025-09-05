
const { Chess } = require('chess.js');
const Player = require('./Player.js');
const {assignMoveIdToBotPlayer, sendMoveRequest} = require('../services/botPlayManager.js');

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
        this.nextMoveId = null;
    }


    setOnMoveCallback(callback) {
        this.onMove = callback
    }
    requestMove(nextMoveId) {
        this.nextMoveId = nextMoveId;
        assignMoveIdToBotPlayer(nextMoveId, this);
        sendMoveRequest({
            moveId: nextMoveId,
            fen: this.board.fen(),
            elo: this.elo   
        }).catch(err => {
            logger.error("Failed to send move request:", err);
           
        });

    }
    
    handleMoveFromBroker(move) {
        this.onMove({"move":move,"moveId":this.nextMoveId})
    }    
    notifyMove(move) {
        this.board.move(move.move)
    }
    notifyBadMove(move) {
        logger.error("BotPlayer received bad move from engine:", move);
        throw new Error("Engine gave bad move somehow");
    }
    getPlayerDetails(){
        return ({type: 'bot', elo:this.elo})
    }
}


module.exports = BotPlayer;