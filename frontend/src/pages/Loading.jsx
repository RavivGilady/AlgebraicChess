import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function Loading() {
  const { loginAsGuest } = useAuth();

  useEffect(() => {
    loginAsGuest();
  }, []);

  return (
    <div className="h-screen grid place-items-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-background border-t-accent rounded-full animate-spin"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
    