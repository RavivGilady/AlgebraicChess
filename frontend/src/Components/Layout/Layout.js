import TopBar from "../TopBar/TopBar";

const Layout = ({ children }) => (
  <div className="min-h-screen w-full flex flex-col">
    <TopBar />
    <main className="flex-1 w-full flex justify-center items-center">
      {children}
    </main>
  </div>
);

export default Layout;
