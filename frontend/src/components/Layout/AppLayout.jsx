import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NavBar from "../Bars/NavBar";
const AppLayout = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className=" w-full flex flex-col min-h-screen">
      <NavBar />
      {children}
    </div>
  );
};

export default AppLayout;
