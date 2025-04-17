const logger = require('../utils/logger')
const Game = require('../Game/game')
const BotPlayer = require('../players/BotPlayer')
const HumanPlayer = require('../players/HumanPlayer')
const { userSockets } = require('../utils/socketsStore');
let activeGames = []
let lobbyRoom = []
let gameEnded = []
const startGame = function (firstPlayer,secondPlayer,res) {
    if (secondPlayer.vs === 'bot') {
        let newGame = new Game();
        let bot = new BotPlayer(2000)
        newGame.addPlayer(bot);
        newGame.addPlayer(firstPlayer)
        newGame.startGame();
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
    gameAgainstBot: (player, elo,res) =>{
        logger.info(`player wants to play ${JSON.stringify (player)}`)
        startGame(new HumanPlayer(userSockets.get(player.username),{elo:player.elo,username:player.username}), { vs: 'bot', elo: elo },res)}
    
    ,
    gameAgainstHuman: () => startGame({ vs: 'human' })
}