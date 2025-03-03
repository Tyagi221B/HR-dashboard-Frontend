import React, { useState } from "react";
import "../css/Modal.css";

const AttendanceModal = ({ isOpen, onClose, onSubmit, employeeData }) => {
  const [attendanceData, setAttendanceData] = useState({
    date: new Date().toISOString().split('T')[0],
    status: "Present",
    notes: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAttendanceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!attendanceData.date || !attendanceData.status) {
      alert("Please fill in all required fields");
      return;
    }

    onSubmit(attendanceData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal attendance-modal">
        {/* Header */}
        <div className="modal-header">
          <h2>Mark Attendance for {employeeData?.fullName}</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Form */}
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                Date<span className="required">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={attendanceData.date}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label>
                Attendance Status<span className="required">*</span>
              </label>
              <select
                name="status"
                value={attendanceData.status}
                onChange={handleChange}
                required
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Half Day">Half Day</option>
                <option value="Leave">Leave</option>
              </select>
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                name="notes"
                value={attendanceData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Add any notes about attendance..."
              />
            </div>

            {/* Submit Button */}
            <div className="submit-container">
              <button type="submit" className="save-button">
                Mark Attendance
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AttendanceModal;