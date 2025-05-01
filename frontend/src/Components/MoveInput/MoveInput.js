import { useState } from 'react';
import { useGame } from '../../context/GameContext'


const MoveInput = () => {
    const { sendMoveToServer, gameState } = useGame()

    const [move, setMove] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendMoveToServer(move);
            setMove('');
        }
    };

    return (
        <input
            type="text"
            value={move}
            onChange={(e) => setMove(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter move (e.g. e4)"
            disabled={!gameState.isItMyTurn}
        />
    );
};

export default MoveInput;
