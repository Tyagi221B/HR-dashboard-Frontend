import React, { useState } from "react";

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
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, resume: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Send data to parent component
  };

  if (!isOpen) return null; // Hide modal when not open

  return (
    <div className="modal-overlay">
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
          <button type="submit">Add Candidate</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddCandidateModal;
