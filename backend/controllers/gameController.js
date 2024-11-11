//startAGame

const logger = require("../utils/logger")

const startGame = function(opponent) {
    logger.trace(`start game against: ${opponent.vs}`)
}


module.exports = {
    gameAgainstBot:(elo) => startGame({vs:"bot",elo:elo}),
    gameAgainstHuman:()=> startGame({vs:"human"})
}