import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const { token } = useAuth(); // 

const GameContext = createContext();
export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState({
    board: null,
    moves: [],
    lastMove: null,
    isItMyTurn:false
  });
  const [socket, setSocket] = useState(null);
  const [nextMoveId, setNextMoveId] = useState(null);


  useEffect(() => {
    const newSocket = io(SERVER_URL, {
          auth: {
            token: token
          },
        });
    setSocket(newSocket);

    newSocket.once('gameId', () => newSocket.emit('connect to game', gameData.gameId))
    newSocket.on('move made', (move) => {
      setGameState(prev => ({
        ...prev,
        lastMove: move,
        moves: [...prev.moves, move]
      }));
    });
    newSocket.on('bad move', (badMove) => {
     console.log(`Bad Move: ${badMove}`)
      });
    newSocket.on('make move', (newMoveId) => {
        setNextMoveId(newMoveId)
        setGameState(prev => ({
            ...prev,
            isItMyTurn : true
        }))
    })
    return () => newSocket.disconnect();
  }, []);

  const sendMoveToServer = (move) => {
    if (socket) {
        socket.emit(`move ${nextMoveId}`, move)
        setGameState(prev => ({
            ...prev,
            isItMyTurn: false
          }));
    }
  };


  return (
    <GameContext.Provider value={{ gameState, setGameState,sendMoveToServer }}>
      {children}
    </GameContext.Provider>
  );
};