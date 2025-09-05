import MoveBar from "../Bars/MoveBar";
import BottomBar from "../Bars/BottomBar";
const GameLayout = ({ children, handleStartGame, openDialog }) => (
  <div className="flex min-h-screen w-full flex-col">
    <MoveBar />
    <main className="flex w-full flex-1 items-center justify-center pt-[80px]">
      {children}
    </main>
    <BottomBar handleStartGame={handleStartGame} openDialog={openDialog} />
  </div>
);

export default GameLayout;
