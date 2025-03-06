import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import SkeletonLoader from "../components/SkeletonLoader.jsx";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <SkeletonLoader />
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
