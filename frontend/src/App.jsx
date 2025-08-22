import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Auth from './Components/Auth/Auth';
import { AuthProvider } from "./context/AuthContext";
import Game from "./components/Game/Game";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Loading from "./pages/Loading.jsx";
function App() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Loading />;
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<RedirectToGame />} />{" "}
        {/* <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/register" element={<Auth mode="register" />} /> */}
        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/game" element={<Game />} />
        </Route>
        {/* Catch-all */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
}
function RedirectToGame() {
  const { token, loginAsGuest } = useAuth();
  if (!token) {
    // loginAsGuest();
    return <Navigate to="/" replace />;
  }
  const location = useLocation();

  if (location.pathname === "/game") {
    window.location.reload(); // Forces a reload if already at /game
    return null;
  }
}
export default App;
