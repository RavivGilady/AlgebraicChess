import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Card } from "../ui/card";

const NavBar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <Card className="bg fixed top-0 z-10 min-h-[40px] w-full border-0 px-4 py-2 shadow-none transition-all duration-300">
      <div className="flex w-full items-center justify-end gap-2">
        {!isAuthenticated ? (
          <>
            <button
              className="rounded-xl px-3 py-1.5 text-brand-dark transition hover:bg-brand-hover/60"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="rounded-xl px-3 py-1.5 text-brand-dark transition hover:bg-brand-hover/60"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </>
        ) : (
          <>
            <button
              className="rounded-xl px-3 py-1.5 text-brand-dark transition hover:bg-brand-hover/60"
              onClick={() => {
                navigate("/game");
              }}
            >
              Start Game
            </button>
            <button
              className="rounded-xl px-3 py-1.5 text-brand-dark transition hover:bg-brand-hover/60"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </Card>
  );
};

export default NavBar;
