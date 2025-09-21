import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { getRelativeTime } from "@/utils/timeUtils";
import { formatLastPlies } from "@/utils/movesUtils";
const GameRow = ({ game }) => {
  const navigate = useNavigate();
  return (
    <TableRow>
      <TableCell>{game.opponent}</TableCell>
      <TableCell>{formatLastPlies(game.lastMoves)}</TableCell>
      <TableCell>{getRelativeTime(game.lastActivityAt)}</TableCell>
      <TableCell>
        {game.status === "active" ? (
          <button
            onClick={() => navigate(`/game/${game.gameId}`)}
            className="rounded bg-brand-dark px-3 py-1 text-base text-white shadow transition hover:bg-brand-hover"
          >
            Resume Game
          </button>
        ) : (
          game.status
        )}
      </TableCell>
    </TableRow>
  );
};

export default GameRow;
