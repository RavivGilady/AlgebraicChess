import { useState } from 'react';
import { GameProvider } from '../../context/GameContext';
import api from '../../services/api'
import Layout from '../Layout/Layout';
import MovePanel from '../MovePanel/MovePanel';
const Game = () => {
    const [gameId, setGameId] = useState(null);
    const [opponentElo, setOpponentElo] = useState(null);

    const handleStartGame = async () => {
        const response = await api.get('/game/startGameBot', {
            params: { elo: 2000 },
        }); 
        setGameId(response.data.gameId);
        setOpponentElo(response.data.elo);
    };

    return (
        <div className="min-h-screen w-full">
          {!gameId ? (
            // Centered Start Game button
            <div className="flex justify-center items-center min-h-screen bg-[#F9DBBA]">
              <button 
                onClick={handleStartGame}
                className="text-2xl px-6 py-3 bg-[#543A14] text-white rounded-2xl shadow hover:bg-[#6b4b1b] transition"
              >
                Start Game
              </button>
            </div>
          ) : (
            <GameProvider key={gameId} gameId={gameId} opponentElo={opponentElo}>
              <Layout handleStartGame={handleStartGame}>
                <MovePanel />
              </Layout >
            </GameProvider>
          )}
        </div>
      );
      
};

export default Game;
