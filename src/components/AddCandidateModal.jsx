import React, { useEffect, useState } from "react";
import "../css/Modal.css";

const AddCandidateModal = ({ isOpen, onClose, onSubmit, editData = null }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    department: "",
    dateOfJoining: "",
    pdfFile: null,
  });

  const [declaration, setDeclaration] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        pdfFile: file,
      }));
      setFileName(file.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!declaration) {
      alert("Please accept the declaration to continue");
      return;
    }

    if (editData) {
      if (
        !formData.fullName ||
        !formData.email ||
        !formData.phone ||
        !formData.position ||
        !formData.experience ||
        !formData.department ||
        !formData.dateOfJoining
      ) {
        alert("Please fill in all required fields");
        return;
      }
    } else {
      if (
        !formData.fullName ||
        !formData.email ||
        !formData.phone ||
        !formData.position ||
        !formData.experience ||
        !formData.department ||
        !formData.dateOfJoining ||
        !formData.pdfFile
      ) {
        alert("Please fill in all required fields");
        return;
      }
    }

    const candidateData = new FormData();

    candidateData.append("fullName", formData.fullName);
    candidateData.append("email", formData.email);
    candidateData.append("phone", formData.phone);
    candidateData.append("position", formData.position);
    candidateData.append("experience", formData.experience);
    candidateData.append("department", formData.department);

    const date = String(formData.dateOfJoining);
    candidateData.append("dateOfJoining", date);

    // Only append file if one is selected (for both new and edit)
    if (formData.pdfFile) {
      candidateData.append("pdfFile", formData.pdfFile);
    }

    onSubmit(candidateData);
  };

  const modalTitle = editData ? "Edit Candidate" : "Add New Candidate";


  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      position: "",
      experience: "",
      department: "",
      dateOfJoining: "",
      pdfFile: null,
    });
    setDeclaration(false);
    setFileName("");
  };

  useEffect(() => {
    if (editData) {
      const formattedDate = editData.dateOfJoining
        ? new Date(editData.dateOfJoining).toISOString().split("T")[0]
        : "";

      setFormData({
        fullName: editData.fullName || "",
        email: editData.email || "",
        phone: editData.phone || "",
        position: editData.position || "",
        experience: editData.experience || "",
        department: editData.department || "",
        dateOfJoining: formattedDate,
        pdfFile: null, 
      });

      setDeclaration(true);
    } else {
      resetForm();
    }
  }, [editData, isOpen]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="candidate-modal">
        {/* Header */}
        <div className="modal-header">
          <h2>{modalTitle}</h2>
          <button className="close-button" onClick={handleClose}>
            ×
          </button>
        </div>

        {/* Form */}
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* Left Column */}
              <div className="form-column">
                <div className="form-group">
                  <label>
                    Full Name
                    <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    Phone Number<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    Experience<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    Department<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="form-column">
                <div className="form-group">
                  <label>
                    Email Address<span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    Position<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    Date of Joining<span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfJoining"
                    value={formData.dateOfJoining}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    Resume{" "}
                    {editData ? (
                      "(Optional)"
                    ) : (
                      <span className="required">*</span>
                    )}
                  </label>
                  <div className="resume-upload">
                    <span>
                      {fileName ||
                        (editData ? "Keep existing resume" : "Upload")}
                    </span>
                    <input
                      type="file"
                      name="resume"
                      onChange={handleFileChange}
                      id="resume-input"
                      className="file-input"
                      accept=".pdf,.doc,.docx"
                      required={!editData} // Only required for new candidates
                    />
                    <label htmlFor="resume-input" className="upload-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Declaration Checkbox */}
            <div className="declaration">
              <label>
                <input
                  type="checkbox"
                  checked={declaration}
                  onChange={() => setDeclaration(!declaration)}
                  required
                />
                <span>
                  I hereby declare that the above information is true to the
                  best of my knowledge and belief
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="submit-container">
              <button
                type="submit"
                className="save-button"
                disabled={!declaration}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCandidateModal;
