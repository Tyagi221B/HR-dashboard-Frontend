import React from "react";
import Table from "../components/Table";
import Sidebar from "../components/Sidebar";

const AttendancePage = () => {
  // Define table columns
  const columns = [
    { key: "profile", label: "Profile", sortable: false },
    { key: "name", label: "Employee Name", sortable: true },
    { key: "position", label: "Position", sortable: true },
    { key: "department", label: "Department", sortable: true },
    { key: "task", label: "Task", sortable: true },
    { key: "status", label: "Status", sortable: true },
  ];

  // Dummy data
  const attendanceData = [
    {
      id: 1,
      name: "Jane Copper",
      position: "Full Time",
      department: "Designer",
      task: "Dashboard Home page Alignment",
      status: "Present",
      profileImage: "",
    },
    {
      id: 2,
      name: "Arlene McCoy",
      position: "Full Time",
      department: "Designer",
      task: "Dashboard Login page design, Dashboard Home page design",
      status: "Absent",
      profileImage: "",
    },
    {
      id: 3,
      name: "Cody Fisher",
      position: "Senior",
      department: "Backend Development",
      task: "--",
      status: "Absent",
      profileImage: "",
    },
    {
      id: 4,
      name: "Janney Wilson",
      position: "Junior",
      department: "Backend Development",
      task: "Dashboard login page integration",
      status: "Present",
      profileImage: "",
    },
  ];

  // Status filter options
  const filterOptions = [
    { value: "present", label: "Present" },
    { value: "absent", label: "Absent" },
  ];

const statusOptions = ["Present", "Absent"];


  // Action handler
  const handleRowAction = (row) => {
    console.log("Action clicked for:", row);
    // Here you could open a modal to edit attendance, mark present/absent, etc.
  };

  return (
    <div className="page">
      <div className="dashboard-wrapper">
        <Sidebar />
        <div className="content">
          <Table
            title="Attendance"
            columns={columns}
            data={attendanceData}
            onRowAction={handleRowAction}
            filterOptions={filterOptions}
            statusOptions={statusOptions}
            searchPlaceholder="Search employees..."
            showProfileImages={true}
          />
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
