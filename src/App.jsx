import './App.css'
import LoginPage from './page/LoginPage';
import RegistrationPage from './page/RegistrationPage'
import { Routes, Route } from "react-router-dom";

function App() {

  return (
    <Routes>
    <Route path="/register" element={<RegistrationPage />} />
    <Route path="/login" element={<LoginPage />} />
  </Routes>
  )
}

export default App
