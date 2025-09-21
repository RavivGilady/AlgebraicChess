import { useEffect, useState, useMemo } from "react";
import { useGame } from "../../context/GameContext";
import { Card } from "../ui/card";

const BottomBar = ({ handleStartGame, openDialog }) => {
  const { gameState } = useGame();

  useEffect(() => {}, [gameState]);

  return (
    <Card
      className={`fixed bottom-0 z-10 min-h-[40px] w-full bg-accent/30 px-4 py-2 transition-all duration-300`}
    >
      <div className="flex justify-between">
        <button
          onClick={openDialog}
          className="rounded-xl bg-brand-dark px-4 py-2 text-white shadow transition hover:bg-brand-hover"
        >
          Peek Board
        </button>
      </div>
    </Card>
  );
};
export default BottomBar;
