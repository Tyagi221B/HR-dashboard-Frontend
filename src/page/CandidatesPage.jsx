import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Table from "../components/Table";
import AddCandidateModal from "../components/AddCandidateModal"; // Import modal

const columns = [
  { key: "srNo", label: "Sr No.", sortable: false },
  { key: "name", label: "Candidate Name", sortable: true },
  { key: "email", label: "Email Address", sortable: true },
  { key: "phone", label: "Phone Number", sortable: false },
  { key: "position", label: "Position", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "experience", label: "Experience", sortable: true },
];

const employeeData = [
  {
    id: 1,
    srNo: "01",
    name: "Jane Copper",
    email: "jane@example.com",
    phone: "(704) 555-0127",
    position: "Designer Intern",
    status: "New",
    experience: "0",
    action: "...",
    profileImage: "",
  },
  {
    id: 2,
    srNo: "02",
    name: "Janney Wilson",
    email: "janney@example.com",
    phone: "(252) 555-0126",
    position: "Senior Developer",
    status: "New",
    experience: "1+",
    action: "...",
    profileImage: "",
  },
  {
    id: 3,
    srNo: "03",
    name: "Guy Hawkins",
    email: "kenzi@example.com",
    phone: "(907) 555-0101",
    position: "HR Intern",
    status: "New",
    experience: "10+",
    action: "...",
    profileImage: "",
  },
];

const statusOptions = ["New", "Selected", "Rejected", "On Hold", "Interviewed"];


const filterOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

// Action handler
const handleRowAction = (row) => {
  console.log("Action clicked for:", row);
};

const CandidatesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddCandidate = (formData) => {
    console.log("Submitting Candidate:", formData);
    setIsModalOpen(false); // Close modal after submission
  };

  return (
    <div className="page">
      <div className="dashboard-wrapper">
        <Sidebar />
        <div className="content">
          <Table
            title="Candidates"
            columns={columns}
            data={employeeData}
            onRowAction={handleRowAction}
            filterOptions={filterOptions}
            statusOptions={statusOptions}
            addButtonText="Add Candidate"
            showAddButton={true}
            searchPlaceholder="Search employees..."
            showProfileImages={true}
            onButtonClick={() => {
              console.log("Button clicked! Opening modal...");
              setIsModalOpen(true);
            }}
          />
        </div>
      </div>
      <AddCandidateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddCandidate}
      />
    </div>
  );
};

export default CandidatesPage;
