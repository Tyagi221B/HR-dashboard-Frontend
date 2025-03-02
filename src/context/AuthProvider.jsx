import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const verifyToken = async () => {
    try {
      const response = await axiosInstance.get("/user/me");
      return response.data;
    } catch (error) {
      console.error("Token verification failed:", error);
      return null;
    }
  };

  const logout = useCallback(async () => {
    try {
      await axiosInstance.post("/user/logout"); 
    } catch (error) {
      console.error("Logout failed:", error);
    }

    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setUser(null);
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
  
      const storedUser = localStorage.getItem("user");
      const accessToken = localStorage.getItem("accessToken");
  
      if (storedUser && accessToken) {
        try {
          const userData = await verifyToken();
          if (userData) {
            setUser(JSON.parse(storedUser));
          } else {
            console.log("Token invalid. Attempting to refresh...");
          }
        } catch (error) {
          console.log("User session expired. Logging out.", error);
          logout();
        }
      } else {
        console.log("No user found in localStorage.");
      }
  
      setLoading(false);
    };
  
    initAuth();
  }, [logout]);
  

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData.data.user));
    localStorage.setItem("accessToken", userData.data.accessToken);
    setUser(userData.data.user);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
