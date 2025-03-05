import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import SkeletonLoader from "../components/Loader.jsx";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // console.log("⏳ Waiting for authentication to complete...");
    return (
      <div>
        <SkeletonLoader />
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
