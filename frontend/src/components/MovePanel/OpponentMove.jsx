import { useEffect, useState } from "react";
import { useGame } from "../../context/GameContext";

const LastMove = () => {
  const { gameState } = useGame();
  const [visibleMove, setVisibleMove] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (gameState.lastMove) {
      setVisibleMove(gameState.lastMove.move);
      setShow(true);

      const timer = setTimeout(() => {
        setShow(false);
      }, 2000); // show for 2 seconds

      return () => clearTimeout(timer);
    }
  }, [gameState.lastMove]);

  if (!show) return null;

  return (
    <div
      className="last-move-container"
      style={{ opacity: visibleMove ? 1 : 0 }}
    >
      <div className="last-move">
        {visibleMove || "Waiting for opponent..."}
      </div>
    </div>
  );
};

export default LastMove;
