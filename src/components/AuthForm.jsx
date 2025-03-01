import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/AuthForm.css";
import AuthLeftSection from "./AuthLeftSection";


const AuthForm = ({ title, fields, buttonText, linkText, linkUrl, forgotPassword }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (

    <>
    <AuthLeftSection/>
    <div className="right-section">
      <h2>{title}</h2>
      <form>
        {fields.map((field) => (
          <div className="form-group" key={field.name}>
            <label>
              {field.label} {field.required && <span>*</span>}
            </label>
            <input
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              onChange={handleChange}
            />
          </div>
        ))}

        {forgotPassword && <p className="forgot-password">Forgot password?</p>}

        <button className="auth-btn">{buttonText}</button>
      </form>

      <p className="auth-link">
        {linkText} <Link to={linkUrl}>{buttonText === "Register" ? "Login" : "Register"}</Link>
      </p>
    </div>
    </>
  );
};

export default AuthForm;
