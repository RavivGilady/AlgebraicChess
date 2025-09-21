import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "./components/Auth/Auth";
import Home from "./components/Home/Home";
import AppLayout from "./components/Layout/AppLayout";
import PrivateRoute from "./components/Routes/PrivateRoute";
import UnauthenticatedRoute from "./components/Routes/UnauthenticatedRoute";
import GamesPage from "./pages/GamesPage";
import StartGame from "./pages/StartGame";
import ActiveGame from "./pages/ActiveGame";
function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          {/* unauthenticated routes */}
          <Route element={<UnauthenticatedRoute />}>
            <Route path="/login" element={<Auth mode="login" />} />
            <Route path="/register" element={<Auth mode="register" />} />
          </Route>
          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/startGame" element={<StartGame />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/game/:gameId" element={<ActiveGame />} />
          </Route>
          {/* Catch-all */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
