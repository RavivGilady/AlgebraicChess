class User {
    constructor(id, username, elo = 1200) {
        this.id = id;            
        this.username = username;
        this.elo = elo;          
        this.gamesPlayed = 0;    
        this.wins = 0;           
        this.losses = 0;         
        this.status = 'offline'; 
        this.gameHistory = [];   
    }

    updateElo(opponentElo, outcome) {
        const kFactor = 32;
        const expectedScore = 1 / (1 + Math.pow(10, (opponentElo - this.elo) / 400));
        let score;

        if (outcome === 'win') {
            score = 1;
            this.wins += 1;
        } else if (outcome === 'lose') {
            score = 0;
            this.losses += 1;
        } else if (outcome === 'draw') {
            score = 0.5;
        }

        this.elo = Math.round(this.elo + kFactor * (score - expectedScore));
        this.gamesPlayed += 1;
    }

    setStatus(status) {
        const validStatuses = ['online', 'offline', 'in-game'];
        if (validStatuses.includes(status)) {
            this.status = status;
        } else {
            throw new Error('Invalid status');
        }
    }

    addGameToHistory(gameId, result, opponentId) {
        this.gameHistory.push({
            gameId: gameId,
            result: result,         // 'win', 'lose', 'draw'
            opponentId: opponentId,
            timestamp: new Date()
        });
    }

    getWinRate() {
        return this.gamesPlayed > 0 ? (this.wins / this.gamesPlayed) * 100 : 0;
    }

    getUserInfo() {
        return {
            id: this.id,
            username: this.username,
            elo: this.elo,
            status: this.status,
            gamesPlayed: this.gamesPlayed,
            wins: this.wins,
            losses: this.losses,
            winRate: this.getWinRate(),
            gameHistory: this.gameHistory
        };
    }
}

module.exports = User;
