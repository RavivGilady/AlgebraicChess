import { useEffect, useState, useMemo } from "react";
import { useGame } from "../../context/GameContext";
import { Card } from "../ui/card";

//create a bottom bar component that will hold two buttons. put placeholders for now
const BottomBar = ({handleStartGame}) => {
    const { gameState } = useGame();
    
    useEffect(() => {
        // Add any necessary effects here
    }, [gameState]);
    
    
    return (
        <Card
        className={`fixed bottom-0 w-full z-10 transition-all duration-300 px-4 py-2 min-h-[40px] bg-accent/30`}>
        <div className="flex justify-between">
            <button className="px-4 py-2 bg-[#543A14] text-white rounded-xl shadow hover:bg-[#6b4b1b] transition">
            Show Board
            </button>
            <button onClick={handleStartGame} className="px-4 py-2 bg-[#543A14] text-white rounded-xl shadow hover:bg-[#6b4b1b] transition">
            Restart Game
            </button>
        </div>
        </Card>
    );
    }
    export default BottomBar;