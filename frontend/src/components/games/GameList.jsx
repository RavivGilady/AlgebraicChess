import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import GameRow from "./GameRow";
export default function GameList({ games }) {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Opponent</TableHead>
            <TableHead>Winner</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Activity</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {games.map((game) => (
            <GameRow key={game._id} game={game} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
