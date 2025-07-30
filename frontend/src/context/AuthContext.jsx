import { createContext, useContext, useState, useMemo, useEffect} from "react";
import axios from 'axios';

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
  // 🔑 Auto-login as guest if no token
  useEffect(() => {
    const loginAsGuest = async () => {
      try {
        const res = await axios.get(`${serverUrl}/auth/loginAsGuest`);
        const guestToken = res.data.token;
        if (guestToken) {
          localStorage.setItem("jwtToken", guestToken);
          setToken(guestToken);
        }
      } catch (err) {
        console.error("Guest login failed:", err);
      }
    };

    if (!token) {
      loginAsGuest();
    }
  }, [token, serverUrl]);
  return (
    <AuthContext.Provider value={{ token, setToken, username, serverUrl }}>
      {children}
    </AuthContext.Provider>
  );
};
