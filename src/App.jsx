import './App.css'
import Sidebar from './components/Sidebar';
import CandidatesPage from './page/CandidatesPage';
import EmployeesPage from './page/EmployeesPage';
import LeavesPage from './page/LeavesPage';
import LoginPage from './page/LoginPage';
import RegistrationPage from './page/RegistrationPage'
import { Routes, Route } from "react-router-dom";

function App() {

  return (
    <Routes>
    <Route path="/employees" element={<EmployeesPage />} />
    <Route path="/leaves" element={<LeavesPage />} />
    <Route path="/candidates" element={<CandidatesPage />} />
    <Route path="/register" element={<RegistrationPage />} />
    <Route path="/register" element={<RegistrationPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/" element={<Sidebar />} />
  </Routes>
  )
}

export default App
