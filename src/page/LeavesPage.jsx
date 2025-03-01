import React, { useState } from "react";
import ReusableTable from "../components/ReusableTable";
import Sidebar from "../components/Sidebar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../css/LeavePage.css";

const LeavePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Define table columns
  const columns = [
    { key: "profile", label: "Profile", sortable: false },
    { key: "name", label: "Employee Name", sortable: true },
    { key: "date", label: "Date", sortable: true },
    { key: "reason", label: "Reason", sortable: false },
    { key: "status", label: "Status", sortable: true },
  ];

  // Dummy leave data
  const leaveData = [
    {
      id: 1,
      name: "Jane Cooper",
      date: "10/09/24",
      reason: "Visiting House",
      status: "Pending",
      profileImage: "",
    },
    {
      id: 2,
      name: "Cody Fisher",
      date: "08/09/24",
      reason: "Visiting House",
      status: "Approved",
      profileImage: "",
    },
    {
      id: 3,
      name: "Leslie Alexander",
      date: "07/09/24",
      reason: "Medical",
      status: "Rejected",
      profileImage: "",
    },
    {
      id: 4,
      name: "Jacob Jones",
      date: "06/09/24",
      reason: "Family Function",
      status: "Approved",
      profileImage: "",
    },
  ];


  // Filter "Approved" leaves separately
  const approvedLeaves = leaveData.filter(
    (leave) => leave.status === "Approved"
  );
  const nonApprovedLeaves = leaveData.filter(
    (leave) => leave.status !== "Approved"
  );

  // Status filter options
  const filterOptions = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  const statusOptions = ["Pending", "Approved", "Rejected"];

  // Action handler
  const handleRowAction = (row) => {
    console.log("Action clicked for:", row);
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="content">
        <div className="leave-container">
          {/* Main Leave Table */}
          <div className="table-section">
            <ReusableTable
              title="Applied Leaves"
              columns={columns}
              data={nonApprovedLeaves} // Show all except "Approved"
              onRowAction={handleRowAction}
              filterOptions={filterOptions}
              statusOptions={statusOptions}
              searchPlaceholder="Search leaves..."
              showProfileImages={true}
            />
          </div>

          <div className="rightsection">
            {/* Calendar Section */}
            <div className="calendar-section">
              <h3 className="calendar-title">Leave Calendar</h3>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                className="leave-calendar"
              />
            </div>

            {/* Approved Leaves Section (Bottom-Right) */}
            <div className="approved-leaves-section">
              <h3 className="approved-leaves-title">Approved Leaves</h3>
              <ul className="approved-leaves-list">
                {approvedLeaves.map((leave) => (
                  <li key={leave.id} className="approved-leave-item">
                    <strong>{leave.name}</strong> - {leave.date} ({leave.reason}
                    )
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeavePage;
