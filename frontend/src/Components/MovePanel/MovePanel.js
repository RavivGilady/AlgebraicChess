import MoveInput from './MoveInput';
import LastMove from './OpponentMove';
import { useGame } from '../../context/GameContext';

const MovePanel = () => {
  const { gameState } = useGame();

  return (
    <div className="move-panel">
    <div className="last-move">
      <LastMove/>
    </div>
    <div className="move-input">
      {gameState.isItMyTurn && <MoveInput />}
    </div>
  </div>
  );
};

export default MovePanel;