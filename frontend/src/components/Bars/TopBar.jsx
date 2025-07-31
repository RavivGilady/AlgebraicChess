import { useEffect, useState, useMemo } from "react";
import { useGame } from "../../context/GameContext";
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";

const TopBar = () => {
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
      const { color, move } = gameState.moves[i];
      if (color === "white") {
        whiteMove = `${moveNum}. ${move}`;
      } else if (color === "black" && whiteMove) {
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
    <Card
  className={`fixed top-0 w-full z-10 transition-all duration-300 px-4 py-2 min-h-[40px] ${bgOpacity}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <ScrollArea className="w-full">
        <div className="flex gap-4 text-inputText font-bold whitespace-nowrap">
          {formattedMoves.map((line, index) => (
            <span key={index}>{line}</span>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default TopBar;
