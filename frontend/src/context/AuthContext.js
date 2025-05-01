import { createContext, useContext, useState, useMemo } from "react";

// Optional: use a lightweight decoder (no validation)

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("jwtToken") || null);
  const serverUrl =  process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

  const username = useMemo(() => {
    if (!token) return null;
    try {

      return token ? JSON.parse(atob(token.split('.')[1])).username : null;
    } catch {
      return null;
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, username, serverUrl }}>
      {children}
    </AuthContext.Provider>
  );
};
