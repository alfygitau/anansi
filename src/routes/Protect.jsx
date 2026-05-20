import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { auth } = useAuth();

  // 1. Fetch your token from local storage, session storage, or a state provider
  const token = auth?.tokens?.access_token;

  // 2. If there is no token, boot them to the login page
  if (!token) {
    // state={{ from: location }} remembers exactly where the user tried to go
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // 3. If the token exists, render the private page layout seamlessly
  return children;
};

export default ProtectedRoute;
