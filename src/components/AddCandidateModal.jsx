import React, { useState } from "react";
import "../css/modal.css"; // Ensure CSS is imported

const AddCandidateModal = ({ isOpen, onClose, onSubmit }) => {
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    department: "",
    dateOfJoining: "",
    resume: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, resume: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); 
  };

  return (
    <div className={`modal-overlay ${isOpen ? "show" : "hide"}`}>
      <div className="modal">
        <h2>Add Candidate</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="text" name="phone" placeholder="Phone" onChange={handleChange} required />
          <input type="text" name="position" placeholder="Position" onChange={handleChange} required />
          <input type="text" name="experience" placeholder="Experience" onChange={handleChange} required />
          <input type="text" name="department" placeholder="Department" onChange={handleChange} required />
          <input type="date" name="dateOfJoining" onChange={handleChange} required />
          <input type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleFileChange} required />

          <div className="modal-buttons">
            <button type="submit">Add Candidate</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCandidateModal;
