import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, } from 'react-router-dom';
import Home from './Components/Home/Home';
// import Auth from './Components/Auth/Auth';
import { AuthProvider } from './context/AuthContext'
import Game from './Components/Game/Game';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';
import { Navigate, useLocation } from "react-router-dom";

const loginAsGuestUrl = '/auth/loginAsGuest';

function App() {



  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={<RedirectToGame />}
          />          {/* <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/register" element={<Auth mode="register" />} /> */}

          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/game" element={<Game />} />
          </Route>

          {/* Catch-all */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}
function RedirectToGame() {
  const location = useLocation();

  if (location.pathname === "/game") {
    window.location.reload(); // Forces a reload if already at /game
    return null;
  }

  return <Navigate to="/game" replace />;
}
export default App;
