// components/Auth.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';


function Auth({ mode }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const url = `/auth/${mode === 'login' ? 'login' : 'register'}`;
      const response = await api.post(url, { username, password });

      setMessage(response.data.message || `${mode === 'login' ? 'Login' : 'Registration'} successful!`);

      // Store the JWT token after a successful login
      if (mode === 'login' && response.data.token) {
        localStorage.setItem('jwtToken', response.data.token);
        navigate('/game'); // Redirect to home or dashboard
      }
      else if (mode === 'register') {
        navigate('/login'); // Redirect to home or dashboard
      }
    } catch (error) {
      setMessage(error.response?.data?.message || `${mode === 'login' ? 'Login' : 'Registration'} failed.`);
    }
  };

  return (
    <div>
      <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSubmit}>{mode === 'login' ? 'Login' : 'Register'}</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Auth;
