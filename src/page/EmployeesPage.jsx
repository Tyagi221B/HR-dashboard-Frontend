import React from "react";
import Table from "../components/Table";
import Sidebar from "../components/Sidebar";

const EmployeesPage = () => {
  // Define table columns
  const columns = [
    { key: "profile", label: "Profile", sortable: false },
    { key: "name", label: "Employee Name", sortable: true },
    { key: "position", label: "Position", sortable: true },
    { key: "department", label: "Department", sortable: true },
    { key: "email", label: "Email Address", sortable: true },
    { key: "phone", label: "Phone Number", sortable: false },
    { key: "joiningDate", label: "Date of Joining", sortable: true },
  ];

  // Dummy data
  const employeeData = [
    {
      id: 1,
      name: "Jane Copper",
      position: "Full Time",
      department: "Designer",
      email: "jane.copper@example.com",
      phone: "(704) 555-0127",
      joiningDate: "10/06/13",
      status: "active",
      profileImage: "",
    },
    {
      id: 2,
      name: "Cody Fisher",
      position: "Senior",
      department: "Backend Development",
      email: "cody.fisher@example.com",
      phone: "(704) 555-0134",
      joiningDate: "05/07/16",
      status: "active",
      profileImage: "",
    },
    {
      id: 3,
      name: "Arlene McCoy",
      position: "Full Time",
      department: "Designer",
      email: "arlene.mccoy@example.com",
      phone: "(704) 555-0156",
      joiningDate: "12/09/17",
      status: "inactive",
      profileImage: "",
    },
  ];

  // Status filter options
  const filterOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  // Action handler
  const handleRowAction = (row) => {
    console.log("Action clicked for:", row);
    // Here you would typically open a modal, navigate to a detail page, etc.
  };

  return (
    <div className="page">
      <div className="dashboard-wrapper">
        <Sidebar />
        <div className="content">
          <Table
            title="Employees"
            columns={columns}
            data={employeeData}
            onRowAction={handleRowAction}
            filterOptions={filterOptions}
            searchPlaceholder="Search employees..."
            showProfileImages={true}
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeesPage;
