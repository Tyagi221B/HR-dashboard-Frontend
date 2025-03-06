import "./App.css";
import AttendancePage from "./page/AttendancePage";
import CandidatesPage from "./page/CandidatesPage";
import EmployeesPage from "./page/EmployeesPage";
import LeavePage from "./page/LeavesPage";
import LoginPage from "./page/LoginPage";
import RegistrationPage from "./page/RegistrationPage";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/useAuth";
import { useEffect, useState } from "react";
import Loader from "./components/Loader";
function App() {
  const { loading } = useAuth();
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsAppLoading(false);
    }, 1200);
  }, []);

  if (isAppLoading || loading) {
    return <Loader />;
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <EmployeesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <CandidatesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <AttendancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaves"
          element={
            <ProtectedRoute>
              <LeavePage />
            </ProtectedRoute>
          }
        />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
