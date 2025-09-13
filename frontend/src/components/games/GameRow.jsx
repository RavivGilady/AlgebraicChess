import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
const GameRow = ({ game }) => {
  const navigate = useNavigate();
  return (
    <TableRow>
      <TableCell>{game.opponent}</TableCell>
      <TableCell>{game.winner}</TableCell>

      <TableCell>{game.status}</TableCell>
      <TableCell>
        {game.lastActivityAt
          ? new Date(game.lastActivityAt).toLocaleString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : ""}
      </TableCell>
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
