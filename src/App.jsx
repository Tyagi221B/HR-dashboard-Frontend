import "./App.css";
import AttendancePage from "./page/AttendancePage";
import CandidatesPage from "./page/CandidatesPage";
import EmployeesPage from "./page/EmployeesPage";
import LeavePage from "./page/LeavesPage";
import LoginPage from "./page/LoginPage";
import RegistrationPage from "./page/RegistrationPage";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";


function App() {
  return (
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
  );
}

export default App;
