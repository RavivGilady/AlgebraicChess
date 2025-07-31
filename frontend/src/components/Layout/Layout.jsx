import TopBar from "../Bars/TopBar";
import BottomBar from "../Bars/BottomBar";
const Layout = ({ children, handleStartGame, openDialog }) => (
  <div className="min-h-screen w-full flex flex-col">
    <TopBar />
    <main className="flex-1 w-full flex justify-center items-center">
      {children}
    </main>
    <BottomBar handleStartGame={handleStartGame} openDialog={openDialog}/>
  </div>
);

export default Layout;
