const Player = require('./Player.js');

class HumanPlayer extends Player {
    constructor(socket) {
        super();
        this.socket = socket;
        this.onMove = null
    }
    setColor(color){
        this.socket.emit("color",color);
    }

    notifyBadMove(move) {
        this.socket.emit("bad move", move);
    }
    gameOver(reason, winner) {
        this.socket.emit("game Over", reason, winner);
    }
    notifyMove(move) {
        this.socket.emit("move made", move);
    }
    setOnMoveCallback(callback){
        this.onMove = callback;
    }

    requestMove(moveId){
        if(this.onMove == null){
            throw new Error("player doesn't have a callback!")
        }
        this.socket.emit("make move",moveId)
        this.socket.once('move', move =>this.onMove(move,moveId))
    }

}

module.exports = HumanPlayer;

