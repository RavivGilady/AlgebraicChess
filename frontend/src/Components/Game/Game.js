import { useState } from 'react';
import { GameProvider } from '../../context/GameContext';
import MoveInput from '../MoveInput/MoveInput';
import {useAuth} from '../../context/AuthContext'
import api from '../../services/api'

const Game = () => {
    const [gameId, setGameId] = useState(null);
    const [opponentElo, setOpponentElo] = useState(null);

    const handleStartGame = async () => {
        const response = await api.get(`${process.env.REACT_APP_API_BASE_URL}/game/startGameBot`, {
            params: { elo: 2000 },
        }); 
        console.log(`game id is ${response.data.gameId}`)
        setGameId(response.data.gameId);
        setOpponentElo(response.data.elo);
    };

    return (
        <div>
            {!gameId ? (
                <button onClick={handleStartGame}>Start Game</button>
            ) : (
                <>
                    <button onClick={handleStartGame}>Restart Game</button>
                    <GameProvider key={gameId} gameId={gameId} opponentElo={opponentElo}>
                        <MoveInput></MoveInput>
                    </GameProvider>

                </>
            )}
        </div>
    );
};

export default Game;
