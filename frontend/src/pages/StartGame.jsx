import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
export default function StartGame() {
  const navigate = useNavigate();
  const [resumeToken, setResumeToken] = useState(null);
  const handleStartGame = async () => {
    const response = await api.get("/games/startGameBot", {
      params: { elo: 1300 },
    });
    const {
      gameId: newGameId,
      opponentElo: oppElo,
      resumeToken: rt,
    } = response.data || {};
    if (newGameId && rt) {
      navigate(`/game/${newGameId}`);
      try {
        sessionStorage.setItem(`resumeToken:${newGameId}`, rt);
      } catch {}
    }
  };

  return (
    <div className="bg flex min-h-screen items-center justify-center">
      <button
        onClick={handleStartGame}
        className="rounded-2xl bg-brand-dark px-6 py-3 text-2xl text-white shadow transition hover:bg-brand-hover"
      >
        Start Game
      </button>
    </div>
  );
}
