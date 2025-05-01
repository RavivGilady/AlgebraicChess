const logger = require('../utils/logger.js')

const Player = require('./Player.js');

class HumanPlayer extends Player {
    constructor(socket, playerDetails) {
        super();
        this.socket = socket;
        this.onMove = null;
        this.playerDetails = playerDetails;
    }
    sendMessage(...args) {
        if (this.socket) {
            this.socket.emit(...args);
        }
    }
    setColor(color) {
        this.sendMessage("color", color);
    }

    notifyBadMove(move) {
        this.sendMessage("bad move", move);
    }
    gameOver(reason, winner) {
        this.sendMessage("game Over", reason, winner);
    }
    notifyMove(move) {
        this.sendMessage("move made", move);
    }
    setOnMoveCallback(callback) {
        this.onMove = callback;
    }

    requestMove(moveId) {
        if (this.onMove == null) {
            throw new Error("player doesn't have a callback!")
        }
        this.sendMessage("make move", moveId)

        this.socket.once(`move ${moveId}`, move => this.onMove({ "move": move, "moveId": moveId }))
    }

    getPlayerDetails() {
        return ({ type: 'human', elo: this.playerDetails.elo, name: this.playerDetails.username })
    }

}

module.exports = HumanPlayer;

