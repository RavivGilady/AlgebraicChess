import { useState, useEffect } from 'react';
import { GameProvider } from '../../context/GameContext';
import api from '../../services/api'
import Layout from '../Layout/Layout';
import MovePanel from '../MovePanel/MovePanel';
import BoardDialog from '../boardDialog/boardDialog';
const Game = () => {
    const [gameId, setGameId] = useState(null);
    const [opponentElo, setOpponentElo] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
    if (!isDialogOpen) return;

    const timer = setTimeout(() => {
      setIsDialogOpen(false);
    }, 2000);

    return () => clearTimeout(timer); // Reset timer on repeated opens
  }, [isDialogOpen]);

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
              <Layout handleStartGame={handleStartGame} openDialog={() => setIsDialogOpen(true)}>
                <MovePanel />
              <BoardDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
              </Layout >
            </GameProvider>
          )}
        </div>
      );
      
};

export default Game;
