import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";
import api from "../services/api"; // Adjust the import path as necessary
import { decodeJwt } from "@/utils/jwt";
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);
const serverUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function isExpired(t, skew = 15) {
  const p = decodeJwt(t);
  return p?.exp ? p.exp * 1000 - Date.now() <= skew * 1000 : false;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("jwtToken"));
  const claims = useMemo(() => (token ? decodeJwt(token) : null), [token]);
  const user = claims
    ? {
        username: claims.username,
        id: claims.id,
        elo: claims.elo,
      }
    : null;
  const isAuthenticated = useMemo(() => !!token && !isExpired(token), [token]);
  const [isLoading, setIsLoading] = useState(false);
  const setAndStoreToken = useCallback((t) => {
    if (t) {
      localStorage.setItem("jwtToken", t);
      setToken(t);
    } else {
      localStorage.removeItem("jwtToken");
      setToken(null);
    }
  }, []);

  const login = useCallback(
    async (username, password) => {
      setIsLoading(true);
      try {
        const r = await api.post("/auth/login", { username, password });
        const t = r?.data?.token;
        if (t) setAndStoreToken(t);
        return { ok: true, token: t };
      } catch (e) {
        return {
          ok: false,
          error: e?.response?.data?.message || e?.message || "Login failed",
        };
      } finally {
        setIsLoading(false);
      }
    },
    [setAndStoreToken],
  );

  const register = useCallback(async (username, password) => {
    setIsLoading(true);
    try {
      await api.post("/auth/register", { username, password });
      return { ok: true };
    } catch (e) {
      return {
        ok: false,
        error:
          e?.response?.data?.message || e?.message || "Registration failed",
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginAsGuest = useCallback(async () => {
    setIsLoading(true);
    const r = await api.get("/auth/loginAsGuest");
    const t = r?.data?.token;
    if (t) setAndStoreToken(t);
    return t ?? null;
  }, [setAndStoreToken]);

  useEffect(() => {}, [token]);
  const logout = useCallback(() => setAndStoreToken(null), [setAndStoreToken]);

  useEffect(() => {
    let timeoutId;

    if (token) {
      const payload = decodeJwt(token);
      const expiresAt = payload?.exp ? payload.exp * 1000 : 0;

      if (expiresAt > Date.now()) {
        setIsLoading(false);

        // schedule auto-logout
        timeoutId = setTimeout(() => {
          console.log("Token expired, logging out");
          localStorage.removeItem("jwtToken");
          setToken(null);
        }, expiresAt - Date.now());
      } else {
      }
    } else {
    }

    return () => clearTimeout(timeoutId);
  }, [logout, token]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        register,
        loginAsGuest,
        logout,
        serverUrl,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
