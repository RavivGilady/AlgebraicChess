import { useEffect, useState, useMemo } from "react";
import { useGame } from "../../context/GameContext";
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";

const MoveBar = () => {
  const [hovered, setHovered] = useState(false);
  const [recentlyUpdated, setRecentlyUpdated] = useState(false);
  const { gameState } = useGame();

  useEffect(() => {
    if (!gameState.moves?.length) return;
    setRecentlyUpdated(true);
    const timer = setTimeout(() => setRecentlyUpdated(false), 2000);
    return () => clearTimeout(timer);
  }, [gameState.moves.length]);

  const formattedMoves = useMemo(() => {
    const result = [];
    let moveNum = 1;
    let whiteMove = null;

    for (let i = 0; i < gameState.moves.length; i++) {
      const move = gameState.moves[i];
      if (whiteMove === null) {
        whiteMove = `${moveNum}. ${move}`;
      } else {
        result.push(`${whiteMove} ${move}`);
        whiteMove = null;
        moveNum++;
      }
    }

    if (whiteMove) result.push(whiteMove);
    return result;
  }, [gameState.moves]);

  const bgOpacity = hovered
    ? "bg-accent/100"
    : recentlyUpdated
      ? "bg-accent/80"
      : "bg-accent/30";

  return (
    <div
      className={`fixed top-[40px] z-10 min-h-[40px] w-full px-4 py-2 transition-all duration-300 ${bgOpacity}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <ScrollArea className="w-full">
        <div className="flex gap-4 whitespace-nowrap font-bold text-inputText">
          {formattedMoves.map((line, index) => (
            <span key={index}>{line}</span>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MoveBar;
