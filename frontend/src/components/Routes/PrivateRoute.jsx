import { useAuth } from "../../context/AuthContext"; // Use the custom hook here
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth(); // Access auth state

  if (!isAuthenticated) {
    return <Navigate to="/" />; // Redirect if not authenticated
  }

  return <Outlet />; // Render the protected content (Dashboard)
};

export default PrivateRoute;
