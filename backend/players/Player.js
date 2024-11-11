class Player {
  setOnMoveCallback(callback) {
    throw new Error("setOnMoveCallback must be implemented by subclasses");
  }
  setColor(){
    
  }
  requestMove(nextMoveId) {
  }
  gameOver(reason, winner) {
    throw new Error("gameOver must be implemented by subclasses");
  }
  notifyMove(move) {
    throw new Error("notifyMove must be implemented by subclasses");

  }
  notifyBadMove(move) {
    throw new Error("notifyBadMove must be implemented by subclasses");
  }
  getPlayerDetails(){
    throw new Error("getPlayerDetails must be implemented by subclasses");

  }
  
}
module.exports = Player;
