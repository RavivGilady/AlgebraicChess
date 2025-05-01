import TopBar from "../TopBar/TopBar"


const Layout = ({ children }) => (
    <div className="min-h-screen flex flex-col">
<TopBar />
      <main className="flex-grow flex justify-center items-center">
        {children}
      </main>
    </div>
  )

export default Layout