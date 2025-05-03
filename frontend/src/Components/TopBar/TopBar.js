import { useEffect, useState, useMemo } from 'react';
import { useGame } from '../../context/GameContext';

const TopBar = () => {
  const [hovered, setHovered] = useState(false)
  const [recentlyUpdated, setRecentlyUpdated] = useState(false);
  const { gameState } = useGame();


  useEffect(() => {
    let moves = gameState.moves;
    if (!moves || moves.length === 0) return;
    setRecentlyUpdated(true);
    const timer = setTimeout(() => setRecentlyUpdated(false), 2000);
    return () => clearTimeout(timer);
  }, [gameState.moves.length]);

  // Format moves into chess notation (1. e4 e5, 2. Nf3 Nc6, etc.)

  const formattedMoves = useMemo(() => {
    const result = [];
    let moveNum = 1;
    let whiteMove = null;
  
    for (let i = 0; i < gameState.moves.length; i++) {
      const { color, move } = gameState.moves[i];
  
      if (color === 'white') {
        whiteMove = `${moveNum}. ${move}`;
      } else if (color === 'black' && whiteMove) {
        result.push(`${whiteMove} ${move}`);
        whiteMove = null;
        moveNum++;
      }
    }
  
    // If the last move is by white, show it alone
    if (whiteMove) {
      result.push(whiteMove);
    }
  
    return result;
  }, [gameState.moves]);
  


  const bgOpacity = hovered
    ? 'bg-[#FFF0DC]/100'
    : recentlyUpdated
      ? 'bg-[#FFF0DC]/80'
      : 'bg-[#FFF0DC]/30';
  return (
    <div
      className={`transition-all duration-300 px-4 py-2 ${bgOpacity} fixed top-0 w-full z-10 flex justify-start overflow-hidden`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex gap-4 text-[#543A14] font-bold whitespace-nowrap overflow-hidden">
        {formattedMoves.map((line, index) => (
          <span key={index}>{line}</span>
        ))}
      </div>
    </div>
  );
}
export default TopBar;
