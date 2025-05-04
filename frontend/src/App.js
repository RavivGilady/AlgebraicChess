import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, } from 'react-router-dom';
import Home from './Components/Home/Home';
// import Auth from './Components/Auth/Auth';
import { AuthProvider } from './context/AuthContext'
import Game from './Components/Game/Game';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';
import api from './services/api';
const loginAsGuestUrl = '/auth/loginAsGuest';

function App() {

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (!token) { 
      api.get(loginAsGuestUrl)
        .then(res => {
          localStorage.setItem("token", res.data.token);
        })
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Game />} />
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
    </AuthProvider>
  );
}

export default App;
