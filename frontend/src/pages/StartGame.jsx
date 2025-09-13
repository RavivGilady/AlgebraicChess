import api from "../services/api";
import { useNavigate } from "react-router-dom";
export default function StartGame() {
  const navigate = useNavigate();
  const handleStartGame = async () => {
    const response = await api.get("/game/startGameBot", {
      params: { elo: 2000 },
    });
    navigate(`/game/${response.data.gameId}`);
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
