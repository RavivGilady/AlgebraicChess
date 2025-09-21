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
  const [resumeToken, setResumeToken] = useState(null);
  useEffect(() => {
    if (!isDialogOpen) return;

    const timer = setTimeout(() => {
      setIsDialogOpen(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [isDialogOpen]);

  const handleStartGame = async () => {
    const response = await api.get("/games/startGameBot", {
      params: { elo: 1300 },
    });
    const {
      gameId: newGameId,
      opponentElo: oppElo,
      resumeToken: rt,
    } = response.data || {};
    if (newGameId && rt) {
      try {
        sessionStorage.setItem(`resumeToken:${newGameId}`, rt);
      } catch {}
      setResumeToken(rt);
    }
    // setGameId(newGameId);
    setOpponentElo(oppElo);
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
        <GameProvider
          key={gameId}
          gameId={gameId}
          opponentElo={opponentElo}
          resumeToken={resumeToken}
        >
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
