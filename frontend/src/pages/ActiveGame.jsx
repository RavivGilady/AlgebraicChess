import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { GameProvider } from "../context/GameContext";
import GameLayout from "../components/Layout/GameLayout";
import MovePanel from "../components/MovePanel/MovePanel";
import BoardDialog from "../components/boardDialog/boardDialog";
export default function ActiveGame() {
  const { gameId } = useParams();
  const [opponentElo, setOpponentElo] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  useEffect(() => {
    if (!isDialogOpen) return;

    const timer = setTimeout(() => {
      setIsDialogOpen(false);
    }, 2000);

    return () => clearTimeout(timer); // Reset timer on repeated opens
  }, [isDialogOpen]);

  return (
    <div className="min-h-screen w-full">
      {
        <GameProvider key={gameId} gameId={gameId} opponentElo={opponentElo}>
          <GameLayout
            openDialog={() => setIsDialogOpen(true)}
          >
            <MovePanel />
            <BoardDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
          </GameLayout>
        </GameProvider>
      }
    </div>
  );
}
