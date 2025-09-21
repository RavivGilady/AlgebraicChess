// components/Auth.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Auth({ mode }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login, register, isLoading } = useAuth();

  const handleSubmit = async () => {
    setMessage("");
    if (mode === "login") {
      const r = await login(username, password);
      if (r.ok) {
        navigate("/startGame");
      } else {
        setMessage(r.error || "Login failed.");
      }
    } else {
      const r = await register(username, password);
      if (r.ok) {
        setMessage("Registration successful. You can now log in.");
        navigate("/login");
      } else {
        setMessage(r.error || "Registration failed.");
      }
    }
  };

  const buttonClasses =
    mode === "login"
      ? "rounded-2xl bg-brand-hover px-4 py-2 text-white font-semibold shadow hover:bg-brand-dark transition focus:outline-none focus:ring-2 focus:ring-brand-dark focus:ring-offset-2"
      : "rounded-2xl bg-brand-dark px-4 py-2 text-white font-semibold shadow hover:bg-brand-hover transition focus:outline-none focus:ring-2 focus:ring-brand-dark focus:ring-offset-2";

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-light px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow">
        <h2 className="mb-4 text-2xl font-semibold text-brand-dark">
          {mode === "login" ? "Login" : "Register"}
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-dark"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-dark"
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={buttonClasses}
          >
            {isLoading
              ? "Please wait..."
              : mode === "login"
                ? "Login"
                : "Register"}
          </button>
          {message && <p className="text-sm text-red-600">{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default Auth;
