import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Table from "../components/Table";
import AddCandidateModal from "../components/AddCandidateModal";
import {
  getAllCandidates,
  addCandidate,
  updateCandidateStatus,
  deleteCandidate,
} from "../api/candidateAPI";
import { toast } from "react-hot-toast";
import SkeletonLoader from "../components/Loader";

const columns = [
  { key: "srNo", label: "Sr No.", sortable: false },
  { key: "fullName", label: "Candidate Name", sortable: true },
  { key: "email", label: "Email Address", sortable: true },
  { key: "phone", label: "Phone Number", sortable: false },
  { key: "position", label: "Position", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "experience", label: "Experience", sortable: true },
];

const statusOptions = ["New", "Selected", "Rejected", "On Hold", "Interviewed"];

const filterOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const CandidatesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await getAllCandidates();

      if (!response || !response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid API response format");
      }

      const formattedCandidates = response.data.map((candidate, index) => ({
        id: candidate._id,
        srNo: (index + 1).toString().padStart(2, "0"),
        fullName: candidate.fullName,
        email: candidate.email,
        phone: candidate.phone,
        position: candidate.position,
        status: candidate.status || "New",
        experience: candidate.experience,
        department: candidate.department,
        dateOfJoining: candidate.dateOfJoining,
        createdBy: candidate.createdBy,
      }));

      setCandidates(formattedCandidates);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast.error(error.message || "Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCandidate = async (formData) => {
    if (
      !formData.get("fullName") ||
      !formData.get("email") ||
      !formData.get("phone")
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // console.log(formData.get("fullName"));
    // console.log(formData.get("email"));
    // console.log(formData.get("dateOfJoining"));
    // console.log(formData.get("pdfFile"));

    try {
      setIsModalOpen(false);
      toast.loading("Adding candidate...");
      await addCandidate(formData);
      toast.dismiss();
      toast.success("Candidate added successfully");
      await fetchCandidates();
    } catch (error) {
      toast.dismiss();
      console.error("Error adding candidate:", error);
      toast.error(error.response?.data?.message || "Failed to add candidate");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateCandidateStatus(id, newStatus);
      toast.success(`Status updated to ${newStatus}`);
      await fetchCandidates();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleDeleteCandidate = async (id) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      try {
        await deleteCandidate(id);
        toast.success("Candidate deleted successfully");
        fetchCandidates();
      } catch (error) {
        console.error("Error deleting candidate:", error);
        toast.error("Failed to delete candidate");
      }
    }
  };

  // Action handler for row operations
  const handleRowAction = (row, action) => {
    if (action === "delete") {
      handleDeleteCandidate(row.id);
    } else if (action === "status") {
      // This would be handled by a dropdown in the table component
      console.log("Status change handled in the Table component");
    }
  };

  return (
    <div className="page">
      <div className="dashboard-wrapper">
        <Sidebar />
        <div className="content">
          {loading ? (
            <div>
              <SkeletonLoader />
            </div>
          ) : (
            <Table
              title="Candidates"
              columns={columns}
              data={candidates}
              onRowAction={handleRowAction}
              onStatusChange={handleStatusChange}
              filterOptions={filterOptions}
              statusOptions={statusOptions}
              addButtonText="Add Candidate"
              showAddButton={true}
              searchPlaceholder="Search candidates..."
              showProfileImages={false}
              loading={loading}
              onButtonClick={() => setIsModalOpen(true)}
            />
          )}
        </div>
      </div>
      <AddCandidateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => handleAddCandidate(data)}
      />
    </div>
  );
};

export default CandidatesPage;
