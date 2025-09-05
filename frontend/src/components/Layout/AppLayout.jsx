import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NavBar from "../Bars/NavBar";
const AppLayout = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <NavBar />
      {children}
    </div>
  );
};

export default AppLayout;
