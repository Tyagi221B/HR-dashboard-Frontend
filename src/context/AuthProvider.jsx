import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const logout = useCallback(async () => {
    try {
      await axiosInstance.post("/user/logout"); 
    } catch (error) {
      console.error("Logout failed:", error);
    }

    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    
    setUser(null);
    navigate("/login");
  }, [navigate]);

  const refreshToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await axiosInstance.post("/user/refresh-token", {
        refreshToken: refreshToken
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data.data;
      
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      return accessToken;
    } catch (error) {
      console.error("Token refresh failed:", error);
      
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      
      // Force logout
      await logout();
      
      return null;
    }
  }, [logout]);

  const verifyToken = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/user/me");
      return response.data.data;
    } catch (error) {
      console.error("Token verification failed:", error);
      
      if (error.response && error.response.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          try {
            const retryResponse = await axiosInstance.get("/user/me");
            return retryResponse.data.data;
          } catch {
            // If retry fails, logout
            await logout();
            return null;
          }
        }
      }
      
      return null;
    }
  }, [refreshToken, logout]);

  const login = (userData) => {
    const { user, accessToken, refreshToken } = userData.data;
    
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    
    setUser(user);
    navigate("/");
  };

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
            await logout();
          }
        } catch (error) {
          console.log("Authentication failed. Logging out.", error);
          await logout();
        }
      }
  
      setLoading(false);
    };
  
    initAuth();
  }, [verifyToken, logout]);

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Only retry once
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await refreshToken();
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return axiosInstance(originalRequest);
            } else {
              await logout();
            }
          } catch {
            await logout();
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [logout, refreshToken]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };