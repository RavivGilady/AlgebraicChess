import MoveInput from "./MoveInput";
import LastMove from "./OpponentMove";
import { useGame } from "../../context/GameContext";

const MovePanel = () => {
  const { gameState } = useGame();

  return (
    <div className="fixed left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl p-4">
      <div>{gameState.isItMyTurn && <MoveInput />}</div>
    </div>
  );
};

export default MovePanel;
