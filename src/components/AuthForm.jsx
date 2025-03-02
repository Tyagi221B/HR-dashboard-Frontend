import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/AuthForm.css";
import AuthLeftSection from "./AuthLeftSection";
import { registerUser, loginUser } from "../api/authApi";
import { useAuth } from "../context/useAuth.js"; // Import AuthContext

const AuthForm = ({ title, fields, buttonText, linkText, linkUrl, forgotPassword, onSubmitAction }) => {


  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); 


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (onSubmitAction === "register") {
        await registerUser(formData);
        navigate("/login");
      } else if (onSubmitAction === "login") {
        const userData = await loginUser(formData); 
        login(userData); 
        navigate("/"); 
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <AuthLeftSection />
      <div className="right-section">
        <h2>{title}</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div className="form-group" key={field.name}>
              <label>
                {field.label} {field.required && <span>*</span>}
              </label>
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                required={field.required}
                onChange={handleChange}
              />
            </div>
          ))}

          {forgotPassword && <p className="forgot-password"><Link to="/forgot-password">Forgot password?</Link></p>}

          <button type="submit" className="auth-btn">{buttonText}</button>
        </form>

        <p className="auth-link">
          {linkText} <Link to={linkUrl}>{buttonText === "Register" ? "Login" : "Register"}</Link>
        </p>
      </div>
    </>
  );
};

export default AuthForm;
