const logger = require('../utils/logger')
const Game = require('../Game/game')
const BotPlayer = require('../players/BotPlayer')
let activeGames = []
let lobbyRoom = []
let gameEnded = []
const startGame = function (opponent,res) {
    if (opponent.vs === 'bot') {
        let newGame = new Game();
        let bot = new BotPlayer(2000)
        newGame.addPlayer(bot);
        res.send({ gameId: newGame.gameId })
    }
    else {
    }
}

const connectToGame = function (gameId){

}
const findGame = function (gameId){
    return lobbyRoom.find(game => game.gameId === gameId);
}
module.exports = {
    gameAgainstBot: (elo,res) => startGame({ vs: 'bot', elo: elo },res),
    gameAgainstHuman: () => startGame({ vs: 'human' })
}