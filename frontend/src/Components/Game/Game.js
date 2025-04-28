// components/Game.js
import React, { useState } from 'react';
import api from '../../services/api';
import io from 'socket.io-client';
const SERVER_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

function Game() {
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [myTurn, setMyTurn] = useState(false); // New state to track if it's player's turn
  const [moveDetails, setMoveDetails] = useState({ nextMoveId: null, move: null });

  const token = localStorage.getItem('jwtToken');
  const username = token ? JSON.parse(atob(token.split('.')[1])).username : null;

  const updateMoveDetails = (key, newValue) => {
    setMoveDetails((prevDictionary) => ({
      ...prevDictionary,
      [key]: newValue,
    }));
  };


  const startGameWithBot = async (event) => {
    event.preventDefault()
    setLoading(false);
    setError(null);
    try {
      console.log('startGame')
      handleGame();
      const response = await api.get(`${process.env.REACT_APP_API_BASE_URL}/game/startGameBot`, {
        params: { username: username, elo: 2000 },
      });
      setGameData(response.data);
      console.log(JSON.stringify(response.data))
    } catch (err) {
      setError('Failed to start game with bot.');
    } finally {
      setLoading(false);
    }
  };
  const handleGame = () => {
    const newSocket = io(SERVER_URL, {
      auth: {
        token: token
      },
    });
    newSocket.once('gameId', () => newSocket.emit('connect to game', gameData.gameId))
    newSocket.on('move made', (move) => console.log(`move made: ${JSON.stringify(move)})`))
    newSocket.on('make move', (moveId) => {
      setMyTurn(true)
      updateMoveDetails('nextMoveId', moveId)
    })
    setSocket(newSocket);
  }
  const handleMove = () => {
    socket.emit(`move ${moveDetails.nextMoveId}`, moveDetails.move)
  }
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Start Game with Bot</h1>
      <button style={styles.button} onClick={startGameWithBot} disabled={loading}>
        {loading ? 'Starting...' : 'Start Game'}
      </button>

      {error && <p style={styles.error}>{error}</p>}

      {gameData && (
        <div style={styles.gameInfo}>
          <h2>Game Started</h2>
          <p>Bot Elo: {gameData.elo}</p>
          <p>Game ID: {gameData.gameId}</p>
        </div>
      )}
      <input
        type="text"
        value={moveDetails.move}
        onChange={(e) => updateMoveDetails('move', e.target.value)}
        disabled={!myTurn}
        placeholder="Enter your move"
        style={styles.input}
      />

      <button onClick={handleMove} disabled={!myTurn || !moveDetails.move}>
        Make Move
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  error: {
    color: 'red',
    marginTop: '20px',
  },
  gameInfo: {
    marginTop: '20px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#fafafa',
  },
};

export default Game;
