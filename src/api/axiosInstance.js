import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Access token expired. Trying to refresh...");
      try {
        const refreshResponse = await axiosInstance.post("/user/refresh-token");
        localStorage.setItem(
          "accessToken",
          refreshResponse.data.data.accessToken
        );

        error.config.headers.Authorization = `Bearer ${refreshResponse.data.data.accessToken}`;
        return axiosInstance(error.config);
      } catch (refreshError) {
        console.error("Refresh Token Failed:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
