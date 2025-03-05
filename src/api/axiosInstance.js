import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshTokenPromise = null;

axiosInstance.interceptors.request.use(
  (config) => {
    console.group("Axios Request");
    console.log("URL:", config.url);
    console.log("Method:", config.method);
    
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Token included in request");
    } else {
      console.warn("No access token found");
    }
    
    console.groupEnd();
    
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.group("Axios Response");
    console.log("URL:", response.config.url);
    console.log("Status:", response.status);
    console.groupEnd();
    
    return response;
  },
  (error) => {
    console.group("Axios Error");
    console.error("Error Details:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    console.groupEnd();

    if (error.response && error.response.status === 401) {
      console.warn("Access token expired. Attempting to refresh...");

      if (isRefreshing) {
        console.log("Refresh already in progress, waiting...");
        return refreshTokenPromise;
      }

      isRefreshing = true;

      refreshTokenPromise = new Promise((resolve, reject) => {
        const performTokenRefresh = () => {
          const refreshToken = localStorage.getItem("refreshToken");
          
          if (!refreshToken) {
            isRefreshing = false;
            reject(new Error("No refresh token available"));
            return;
          }

          axios.post(
            `${baseURL}/user/refresh-token`, 
            { refreshToken },
            { 
              withCredentials: true,
              headers: {
                'Skip-Interceptor': 'true'
              }
            }
          )
          .then((refreshResponse) => {
            const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", newRefreshToken);

            error.config.headers.Authorization = `Bearer ${accessToken}`;

            return axios(error.config);
          })
          .then((retryResponse) => {
            resolve(retryResponse);
          })
          .catch((refreshError) => {
            console.error("Token refresh failed completely:", refreshError);
            
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");

            window.location.href = "/login";
            
            reject(refreshError);
          })
          .finally(() => {
            isRefreshing = false;
            refreshTokenPromise = null;
          });
        };

        performTokenRefresh();
      });

      return refreshTokenPromise;
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;