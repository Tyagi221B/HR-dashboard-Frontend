import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const refreshToken = async () => {
    try {
      const response = await axiosInstance.post("/user/refresh-token");
      const { accessToken } = response.data;
      
      localStorage.setItem("accessToken", accessToken);
      return accessToken;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return null;
    }
  };

  const verifyToken = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/user/me");
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          const retryResponse = await axiosInstance.get("/user/me");
          return retryResponse.data;
        }
      }
      return null;
    }
  } , []);

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
  

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData.data.user));
    localStorage.setItem("accessToken", userData.data.accessToken);
    setUser(userData.data.user);
    navigate("/");
  };

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
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };