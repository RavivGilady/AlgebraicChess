import { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { Chess } from "chess.js";
import api from "@/services/api";
import { decodeJwt } from "@/utils/jwt";
const GameContext = createContext();
export const useGame = () => useContext(GameContext);

export const GameProvider = ({ gameId, children }) => {
  const navigate = useNavigate();
  const { token, serverUrl } = useAuth();
  const [color, setColor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState({
    board: new Chess(),
    moves: [],
    lastMove: null,
    isItMyTurn: false,
    turnId: 1,
  });
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);
  const connectionIdRef = useRef(0);

  useEffect(() => {
    const connectionId = ++connectionIdRef.current;
    let currentSocket = null;

    const connectToGame = async () => {
      try {
        let rt = sessionStorage.getItem(`resumeToken:${gameId}`);
        let decoded = decodeJwt(rt);
        if (!decoded || decoded.exp < Date.now() / 1000) {
          sessionStorage.removeItem(`resumeToken:${gameId}`);
          const response = await api.get(`/games/${gameId}/resumeToken`);
          rt = response.data.token;
          sessionStorage.setItem(`resumeToken:${gameId}`, rt);
          decoded = decodeJwt(rt);
        }

        if (!decoded) {
          console.error("Failed to get valid resume token");
          navigate("/games");
          return;
        }

        setColor(decoded.color);
        setLoading(false);

        if (connectionId !== connectionIdRef.current) {
          return;
        }

        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }

        // Now connect with the valid token
        const newSocket = io(serverUrl, {
          auth: {
            token: token,
            gameId: gameId,
            resumeToken: rt,
          },
          transports: ["websocket"],
          withCredentials: true,
        });

        currentSocket = newSocket;
        socketRef.current = newSocket;
        setSocket(newSocket);

        newSocket.on("resumeTokenRotated", (newToken) => {
          sessionStorage.setItem(`resumeToken:${gameId}`, newToken.resumeToken);
        });
        newSocket.on("stateSync", (state) => {
          setGameState((prev) => {
            const board =
              state.fen === "startpos" ? new Chess() : new Chess(state.fen);
            console.log(`state.color: ${state.turn}`);
            console.log(`state.turnId: ${state.turnId}`);
            return {
              ...prev,
              board: board,
              moves: state.moveList,
              lastMove:
                state.turnId > 1 ? state.moveList[state.turnId - 1] : null,
              isItMyTurn: state.turn === decoded.color,
              turnId: state.turnId,
            };
          });
        });
        newSocket.on("moveMade", (event) => {
          setGameState((prev) => {
            const board = new Chess(prev.board.fen());
            board.move(event.move);
            return {
              ...prev,
              board: board,
              lastMove: event.move,
              isItMyTurn: event.by !== decoded.color,
              moves: [...prev.moves, event.move],
              turnId: event.turnId,
            };
          });
        });
        newSocket.on("yourTurn", (event) => {
          setGameState((prev) => ({
            ...prev,
            turnId: event.turnId,
            isItMyTurn: true,
          }));
        });
        newSocket.on("connect_error", (err) => {
          console.error(`Connection error: ${err.message}`);
          navigate("/startGame");
        });
        newSocket.on("disconnect", () => {
          navigate("/games");
        });
      } catch (error) {
        console.error("Failed to connect to game:", error);
        navigate("/games");
      }
    };

    connectToGame();

    return () => {
      if (connectionId === connectionIdRef.current) {
        if (currentSocket) {
          currentSocket.disconnect();
          currentSocket = null;
          setSocket(null);
        }
        if (socketRef.current) {
          socketRef.current = null;
        }
      }
    };
  }, [gameId, serverUrl, token, navigate]);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const sendMoveToServer = async (move) => {
    if (socketRef.current) {
      const board = new Chess(gameState.board.fen());
      if (!board.move(move)) {
        return;
      }
      setGameState((prev) => ({
        ...prev,
        isItMyTurn: false,
      }));
      socketRef.current.emit(`makeMove`, {
        turnId: gameState.turnId,
        move: move,
      });
    }
  };
  useEffect(() => console.log(`color: ${color}`), [color]);

  return (
    <GameContext.Provider
      value={{ gameState, sendMoveToServer, color, loading }}
    >
      {children}
    </GameContext.Provider>
  );
};
