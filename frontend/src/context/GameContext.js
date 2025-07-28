import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext'
import { useNavigate } from "react-router-dom";

const GameContext = createContext();
export const useGame = () => useContext(GameContext);

export const GameProvider = ({ gameId, children }) => {
    const navigate = useNavigate();

  const { token, serverUrl } = useAuth();
  const [gameState, setGameState] = useState({
    board: null,
    moves: [],
    lastMove: null,
    isItMyTurn: false
  });
  const [socket, setSocket] = useState(null);
  const [nextMoveId, setNextMoveId] = useState(null);


  useEffect(() => {
    const newSocket = io(serverUrl, {
      auth: {
        token: token,
        gameId: gameId

      },
      transports: ["websocket"],
      withCredentials: true

    });
    setSocket(newSocket);

    newSocket.once('gameId', () => newSocket.emit('connect to game', gameId))
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
        isItMyTurn: true
      }))
    })
    //handle connect error to redirect to login page
    newSocket.on('connect_error', (err) => {
      console.error(`Connection error: ${err.message}`);
      navigate('/'); 
    });

    
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
  useEffect(() => console.log(`moves list: ${JSON.stringify(gameState.moves)}`), [gameState.moves])

  return (
    <GameContext.Provider value={{ gameState, setGameState, sendMoveToServer }}>
      {children}
    </GameContext.Provider>
  );
};