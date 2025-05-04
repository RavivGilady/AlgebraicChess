import { useAuth } from '../../context/AuthContext'; // Use the custom hook here
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const { token } = useAuth(); // Access auth state

  if (!token) {
    return <Navigate to="/" />; // Redirect if not authenticated
  }

  return <Outlet />; // Render the protected content (Dashboard)
};

export default PrivateRoute;
