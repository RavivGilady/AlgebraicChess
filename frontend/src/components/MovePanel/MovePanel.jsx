import MoveInput from './MoveInput';
import LastMove from './OpponentMove';
import { useGame } from '../../context/GameContext';

const   MovePanel = () => {
  const { gameState } = useGame();

  return (
<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl p-4 flex items-center justify-center">

<div>
{gameState.isItMyTurn && <MoveInput />}
</div>
  </div>
  );
};

export default MovePanel;