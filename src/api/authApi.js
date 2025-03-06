import axios from "./axiosInstance";

export const registerUser = async (userData) => {
  const { data } = await axios.post("/user/register", userData);
  return data;
};

export const loginUser = async (userData) => {
  const { data } = await axios.post("/user/login", userData, { withCredentials: true });
  return data;
};

export const logoutUser = async () => {
  try {
    await axios.post("/user/logout", {}, { 
      withCredentials: true,
      headers: {
        'Skip-Interceptor': 'true'
      }
    });
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    window.location.href = "/login"; 
  }
};


export const getCurrentUser = async () => {
  const { data } = await axios.get("/user/me", { withCredentials: true });
  return data;
};

