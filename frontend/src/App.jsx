import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "./components/Auth/Auth";
import Home from "./components/Home/Home";
import Game from "./components/Game/Game";
import AppLayout from "./components/Layout/AppLayout";
import PrivateRoute from "./components/Routes/PrivateRoute";
import { Navigate, useLocation } from "react-router-dom";
import UnauthenticatedRoute from "./components/Routes/UnauthenticatedRoute";

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
            <Route path="/game" element={<Game />} />
          </Route>
          {/* Catch-all */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </AppLayout>
    </Router>
  );
}
function RedirectToGame() {
  const location = useLocation();
  return <Navigate to="/game" replace />;
}
export default App;
