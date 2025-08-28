const BotPlayer = require("../players/BotPlayer");
const HumanPlayer = require("../players/HumanPlayer");
const {registerToGame} = require ('./gameManager')

function registerAsPlayer (username, elo, socket, gameId) {
    let player = new HumanPlayer(socket, { username: username, elo: elo })
    registerToGame(player,gameId)
}
function createBotToGame (elo, gameId)  {
    let botPlayer = new BotPlayer(elo)
    registerToGame(botPlayer, gameId)
}


module.exports = {
    registerAsPlayer,
    createBotToGame
}