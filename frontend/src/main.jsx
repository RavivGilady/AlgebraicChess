import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // or your global CSS
import { AuthProvider } from "./context/AuthContext"; // Ensure this path is correct
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
