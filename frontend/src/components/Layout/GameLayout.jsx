import MoveBar from "../Bars/MoveBar";
import { useGame } from "../../context/GameContext";
import BottomBar from "../Bars/BottomBar";
const GameLayout = ({ children, openDialog }) => {
  const { loading } = useGame();
  if (loading) {
    return <div>Loading game...</div>;
  }
  return (
    <div className="flex min-h-screen w-full flex-col">
      <MoveBar />
      <main className="flex w-full flex-1 items-center justify-center pt-[80px]">
        {children}
      </main>
      <BottomBar openDialog={openDialog} />
    </div>
  );
};

export default GameLayout;
