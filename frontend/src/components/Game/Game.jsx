import { useState, useEffect } from "react";
import { GameProvider } from "../../context/GameContext";
import api from "../../services/api";
import GameLayout from "../Layout/GameLayout";
import MovePanel from "../MovePanel/MovePanel";
import BoardDialog from "../boardDialog/boardDialog";
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
    const response = await api.get("/game/startGameBot", {
      params: { elo: 2000 },
    });
    setGameId(response.data.gameId);
    setOpponentElo(response.data.elo);
  };

  return (
    <div className="min-h-screen w-full">
      {!gameId ? (
        <div className="bg flex min-h-screen items-center justify-center">
          <button
            onClick={handleStartGame}
            className="rounded-2xl bg-brand-dark px-6 py-3 text-2xl text-white shadow transition hover:bg-brand-hover"
          >
            Start Game
          </button>
        </div>
      ) : (
        <GameProvider key={gameId} gameId={gameId} opponentElo={opponentElo}>
          <GameLayout
            handleStartGame={handleStartGame}
            openDialog={() => setIsDialogOpen(true)}
          >
            <MovePanel />
            <BoardDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
          </GameLayout>
        </GameProvider>
      )}
    </div>
  );
};

export default Game;
