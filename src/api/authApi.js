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
  await axios.post("/user/logout", {}, { withCredentials: true });
};

export const getCurrentUser = async () => {
  await axios.get("/user/me", { withCredentials: true });
}