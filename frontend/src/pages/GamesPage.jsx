import { useState, useEffect } from "react";
import api from "../services/api";
import GameList from "../components/games/GameList";
import { useAuth } from "../context/AuthContext";

export default function GamesPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserGames = async () => {
      if (!user?.id) {
        setError("No user ID found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await api.get(`/user/${user.id}/games`);
        if (response.data.success) {
          const transformedGames = response.data.games.map((game) => ({
            _id: game._id,
            gameId: game._id,
            opponent:
              game.opponent.type === "human"
                ? game.opponent.username + " (" + game.opponent.elo + ")"
                : `Stockfish (${game.opponent.elo})`,

            status: game.status,
            lastActivityAt: game.updatedAt,
            lastMoves: game.moveList,
          }));
          setGames(transformedGames);
        } else {
          setError("Failed to fetch games");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch games");
      } finally {
        setLoading(false);
      }
    };

    fetchUserGames();
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center gap-4 pt-8">
        <h1 className="text-2xl font-bold">Games</h1>
        <div>Loading games...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center gap-4 pt-8">
        <h1 className="text-2xl font-bold">Games</h1>
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center gap-4 pt-8">
      <h1 className="text-2xl font-bold">Games</h1>

      <GameList games={games} />
    </div>
  );
}
