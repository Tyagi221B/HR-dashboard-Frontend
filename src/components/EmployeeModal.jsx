import React, { useEffect, useState } from "react";
import "../css/Modal.css";

const EditEmployeeModal = ({ isOpen, onClose, onSubmit, editData = null }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    department: "",
    dateOfJoining: "",
    salary: "",
    status: "Active",
    pdfFile: null,
  });

  const [declaration, setDeclaration] = useState(false);
  const [fileName, setFileName] = useState("");

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      position: "",
      experience: "",
      department: "",
      dateOfJoining: "",
      salary: "",
      status: "Active",
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
        salary: editData.salary || "",
        status: editData.status || "Active",
        pdfFile: null,
      });
      setDeclaration(true);
    } else {
      resetForm();
    }
  }, [editData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, pdfFile: file }));
      setFileName(file.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!declaration) {
      alert("Please accept the declaration to continue");
      return;
    }

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.position ||
      !formData.experience ||
      !formData.department ||
      !formData.dateOfJoining ||
      !formData.salary
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const employeeData = new FormData();

    employeeData.append("fullName", formData.fullName);
    employeeData.append("email", formData.email);
    employeeData.append("phone", formData.phone);
    employeeData.append("position", formData.position);
    employeeData.append("experience", formData.experience);
    employeeData.append("department", formData.department);
    employeeData.append("salary", formData.salary);
    employeeData.append("status", formData.status);
    employeeData.append("dateOfJoining", formData.dateOfJoining);

    if (formData.pdfFile) {
      employeeData.append("pdfFile", formData.pdfFile);
    }

    onSubmit(employeeData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="candidate-modal">
        <div className="modal-header">
          <h2>{editData ? "Edit Employee" : "Add Employee"}</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-column">
                <div className="form-group">
                  <label>Full Name*</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number*</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Experience*</label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Department*</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-column">
                <div className="form-group">
                  <label>Email Address*</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Position*</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Date of Joining*</label>
                  <input
                    type="date"
                    name="dateOfJoining"
                    value={formData.dateOfJoining}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Salary*</label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Status*</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>

            <div className="form-group">
              <label>Resume (Optional)</label>
              <input
                type="file"
                name="pdfFile"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
              />
              {fileName && <p>Uploaded: {fileName}</p>}
            </div>

            <div className="declaration">
              <label>
                <input
                  type="checkbox"
                  checked={declaration}
                  onChange={() => setDeclaration(!declaration)}
                  required
                />
                I declare that the above information is true.
              </label>
            </div>

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

export default EditEmployeeModal;
