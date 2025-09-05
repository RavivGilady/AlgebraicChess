// components/Home.js
import React from "react";
import { useAuth } from "../../context/AuthContext";

function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl sm:text-4xl font-bold text-brand-dark">
        Welcome to AlgebraicChess
      </h1>
      {!isAuthenticated ? (
        <p className="mt-3 text-brand-dark">
          Please log in or register to continue using the navigation above.
        </p>
      ) : (
        <p className="text-brand-dark">
          Ready to play? Use the "Start Game" button in the navigation above.
        </p>
      )}
    </div>
  );
}

export default Home;
