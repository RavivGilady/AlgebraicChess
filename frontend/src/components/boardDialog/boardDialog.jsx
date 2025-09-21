// create a compontet that will hold the board dialog
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { Chessboard } from "react-chessboard";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DialogHeader } from "@/components/ui/dialog";
import { useGame } from "../../context/GameContext";
import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
const BoardDialog = ({ open, onOpenChange }) => {
  const { gameState, color } = useGame();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="animate-fade-in data-[state=closed]:animate-fade-out">
        <Card>
          <DialogHeader>
            <DialogTitle>
              <VisuallyHidden>Game Board</VisuallyHidden>
            </DialogTitle>
          </DialogHeader>
          <div className="mx-auto h-[400px] w-[400px]">
            <Chessboard
              arePiecesDraggable={false}
              areArrowsAllowed={false}
              position={gameState.board.fen()}
              boardOrientation={color}
            />
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default BoardDialog;
