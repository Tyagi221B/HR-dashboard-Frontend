import { useContext } from "react";
import { AuthContext } from "./AuthProvider"; // Adjust the import path as needed

export const useAuth = () => useContext(AuthContext);
