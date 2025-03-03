import React, { useState, useEffect, useCallback } from "react";
import Table from "../components/Table";
import Sidebar from "../components/Sidebar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../css/LeavePage.css";
import { toast } from "react-hot-toast";
import { 
  getLeaves, 
  getActiveEmployees, 
  addLeave, 
  updateLeaveStatus, 
  deleteLeaveById,
  downloadDocument
} from "../api/leaveApi";

const LeavePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddLeaveModalOpen, setIsAddLeaveModalOpen] = useState(false);
  const [leaveData, setLeaveData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaveFormData, setLeaveFormData] = useState({
    employeeId: "",
    leaveDate: "",
    reason: "",
    pdfFile: null,
    designation: ""
  });

  const columns = [
    { key: "profile", label: "Profile", sortable: false },
    { key: "name", label: "Name", sortable: true },
    { key: "date", label: "Date", sortable: true },
    { key: "reason", label: "Reason", sortable: false },
    { key: "status", label: "Status", sortable: true },
    { key: "docs", label: "Docs", sortable: false },
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const leavesData = await getLeaves();
      const employeesData = await getActiveEmployees();

      // Check if the response has the expected structure
      if (!leavesData.data || !Array.isArray(leavesData.data)) {
        console.error("Invalid leaves data structure:", leavesData);
        toast.error("Invalid data received from server");
        return;
      }

      const formattedLeaveData = leavesData.data.map(leave => ({
        id: leave._id,
        name: leave.employee ? leave.employee.fullName : "Unknown",
        date: new Date(leave.leaveDate).toLocaleDateString("en-IN", { 
          month: "2-digit", day: "2-digit", year: "2-digit" 
        }),
        reason: leave.reason,
        status: leave.status,
        profileImage: "/images/profile.png", 
        docs: leave.documents ? true : false,
        documentId: leave.documents
      }));

      const formattedEmployeeData = employeesData.data.map(emp => ({
        id: emp._id,
        name: emp.fullName,
        designation: emp.position
      }));

      setLeaveData(formattedLeaveData);
      setEmployees(formattedEmployeeData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const approvedLeaves = leaveData.filter(
    (leave) => leave.status === "Approved"
  );

  const filterOptions = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  const statusOptions = ["Pending", "Approved", "Rejected"];

  const handleRowAction = async (row, action) => {
    if (action === "download") {
      if (row.documentId) {
        window.open(downloadDocument(row.documentId), '_blank');
      } else {
        toast.error("No document available for download");
      }
    } else if (action === "delete") {
      try {
        await deleteLeaveById(row.id);
        setLeaveData(prevData => prevData.filter(item => item.id !== row.id));
        toast.success("Leave deleted successfully");
      } catch (error) {
        console.error("Error deleting leave:", error);
        toast.error("Failed to delete leave");
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateLeaveStatus(id, newStatus);
      
      setLeaveData(prevData => 
        prevData.map(leave => 
          leave.id === id ? { ...leave, status: newStatus } : leave
        )
      );
      
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLeaveFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEmployeeSelect = (employeeId) => {
    const selectedEmployee = employees.find(emp => emp.id === employeeId);
    setLeaveFormData(prev => ({ 
      ...prev, 
      employeeId, 
      designation: selectedEmployee ? selectedEmployee.designation : "" 
    }));
  };

  const handleFileUpload = (e) => {
    // Changed from documents to pdfFile to match backend expectation
    setLeaveFormData(prev => ({ ...prev, pdfFile: e.target.files[0] }));
  };

  const handleSubmitLeave = async (e) => {
    e.preventDefault();
    
    if (!leaveFormData.employeeId || !leaveFormData.leaveDate || !leaveFormData.reason) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("employeeId", leaveFormData.employeeId);
      formData.append("leaveDate", leaveFormData.leaveDate);
      formData.append("reason", leaveFormData.reason);
      if (leaveFormData.pdfFile) {
        // Changed to use pdfFile to match backend expectation
        formData.append("pdfFile", leaveFormData.pdfFile);
      }

      const newLeaveData = await addLeave(formData);
      
      const selectedEmployee = employees.find(emp => emp.id === leaveFormData.employeeId);
      const newLeave = {
        id: newLeaveData._id,
        name: selectedEmployee ? selectedEmployee.name : "Unknown",
        date: new Date(leaveFormData.leaveDate).toLocaleDateString("en-US", { 
          month: "2-digit", day: "2-digit", year: "2-digit" 
        }),
        reason: leaveFormData.reason,
        status: "Pending",
        profileImage: "/images/profile.png",
        docs: leaveFormData.pdfFile ? true : false,
        documentId: newLeaveData.documents
      };
      
      setLeaveData(prev => [newLeave, ...prev]);
      
      setLeaveFormData({
        employeeId: "",
        leaveDate: "",
        reason: "",
        pdfFile: null,
        designation: ""
      });
      setIsAddLeaveModalOpen(false);
      toast.success("Leave application submitted successfully");
    } catch (error) {
      console.error("Error submitting leave:", error);
      toast.error("Failed to submit leave application");
    }
  };

  const customTableActions = [
    { type: "download", label: "Download Document" },
    { type: "delete", label: "Delete Leave" },
  ];

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const formattedDate = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    setLeaveFormData(prev => ({ ...prev, leaveDate: formattedDate }));
    setIsAddLeaveModalOpen(true);
  };

  return (
    <div className="page">
      <div className="dashboard-wrapper">
        <Sidebar />
        <div className="content">
          <div className="leave-container">
            <div className="leave-left">
              {loading ? (
                <div>Loading...</div>
              ) : (
                <Table
                  title="Leaves"
                  columns={columns}
                  data={leaveData}
                  onRowAction={handleRowAction}
                  onStatusChange={handleStatusChange}
                  filterOptions={filterOptions}
                  statusOptions={statusOptions}
                  addButtonText="Add Leave"
                  showAddButton={true}
                  searchPlaceholder="Search leaves..."
                  showProfileImages={true}
                  loading={loading}
                  onButtonClick={() => setIsAddLeaveModalOpen(true)}
                  customActions={customTableActions}
                />
              )}
            </div>
            
            <div className="leave-right">
              <div className="calendar-section">
                <h3 className="section-title">Leave Calendar</h3>
                <div className="calendar-wrapper">
                  <Calendar
                    onChange={handleDateClick}
                    value={selectedDate}
                    className="react-calendar"
                    tileClassName={({ date }) => {
                      const formattedDate = date.toLocaleDateString("en-US", { 
                        month: "2-digit", day: "2-digit", year: "2-digit" 
                      });
                      
                      const hasLeave = leaveData.some(leave => leave.date === formattedDate);
                      
                      return hasLeave ? "has-leave" : null;
                    }}
                  />
                </div>
              </div>
              
              <div className="approved-leaves-section">
                <h3 className="section-title">Approved Leaves</h3>
                <div className="approved-leaves-list">
                  {approvedLeaves.length > 0 ? (
                    approvedLeaves.map((leave) => (
                      <div key={leave.id} className="approved-leave-item">
                        <div className="leave-user">
                          {leave.profileImage ? (
                            <img
                              src={leave.profileImage}
                              alt={leave.name}
                              className="leave-user-avatar"
                            />
                          ) : (
                            <div className="leave-user-avatar-placeholder">
                              {leave.name.charAt(0)}
                            </div>
                          )}
                          <div className="leave-user-info">
                            <span className="leave-user-name">{leave.name}</span>
                            <span className="leave-user-date">{leave.date}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-leaves-message">No approved leaves yet</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Modal */}
      {isAddLeaveModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Leave</h2>
              <button 
                className="close-button" 
                onClick={() => setIsAddLeaveModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmitLeave}>
                <div className="form-group">
                  <select
                    name="employeeId"
                    value={leaveFormData.employeeId}
                    onChange={(e) => handleEmployeeSelect(e.target.value)}
                    className="form-control"
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <input
                    type="text"
                    name="designation"
                    placeholder="Designation*"
                    value={leaveFormData.designation}
                    readOnly
                    className="form-control"
                  />
                </div>
                
                <div className="form-group">
                  <input
                    type="date"
                    name="leaveDate"
                    value={leaveFormData.leaveDate}
                    onChange={handleInputChange}
                    placeholder="Leave Date*"
                    className="form-control"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <div className="document-upload">
                    <label htmlFor="document-upload" className="upload-label">
                      Documents (Optional)
                    </label>
                    <input
                      type="file"
                      id="document-upload"
                      onChange={handleFileUpload}
                      className="upload-input"
                      accept=".pdf"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <input
                    type="text"
                    name="reason"
                    value={leaveFormData.reason}
                    onChange={handleInputChange}
                    placeholder="Reason*"
                    className="form-control"
                    required
                  />
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="submit-button">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeavePage;