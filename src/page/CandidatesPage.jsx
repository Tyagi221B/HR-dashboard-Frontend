import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Table from "../components/Table";
import AddCandidateModal from "../components/AddCandidateModal";
import {
  getAllCandidates,
  addCandidate,
  updateCandidateStatus,
  deleteCandidate,
  getResume,
  updateCandidate,
} from "../api/candidateAPI";
import { toast } from "react-hot-toast";
import SkeletonLoader from "../components/SkeletonLoader";

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
  { value: "new", label: "New" },
  { value: "selected", label: "Selected" },
  { value: "rejected", label: "Rejected" },
  { value: "on hold", label: "On Hold" },
  { value: "interviewed", label: "Interviewed" },
];

const CandidatesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCandidate, setEditCandidate] = useState(null);

  const fetchCandidates = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const handleAddCandidate = async (formData, candidateId = null) => {
    if (
      !formData.get("fullName") ||
      !formData.get("email") ||
      !formData.get("phone")
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setIsModalOpen(false);

      if (candidateId) {
        toast.loading("Updating candidate...");
        await updateCandidate(candidateId, formData);
        toast.dismiss();
        toast.success("Candidate updated successfully");
      } else {
        toast.loading("Adding candidate...");
        await addCandidate(formData);
        toast.dismiss();
        toast.success("Candidate added successfully");
      }

      setEditCandidate(null);
      await fetchCandidates();
    } catch (error) {
      toast.dismiss();
      console.error("Error saving candidate:", error);
      toast.error(error.response?.data?.message || "Failed to save candidate");
    }
  };

  const handleEditCandidate = (candidate) => {
    setEditCandidate(candidate);
    setIsModalOpen(true);
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

  const handleDownloadResume = async (id) => {
    try {
      toast.loading("Fetching resume...");
      const response = await getResume(id);
      toast.dismiss();

      if (response && response.data && response.data.resumeUrl) {
        window.open(response.data.resumeUrl, "_blank");
      } else {
        toast.error("Resume URL not found");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error fetching resume:", error);
      toast.error("Failed to fetch resume");
    }
  };

  const handleRowAction = (row, action) => {
    if (action === "delete") {
      handleDeleteCandidate(row.id);
    } else if (action === "download") {
      handleDownloadResume(row.id);
    } else if (action === "edit") {
      handleEditCandidate(row);
    }
  };

  const customTableActions = [
    { type: "edit", label: "Edit Candidate" },
    { type: "download", label: "Download Resume" },
    { type: "delete", label: "Delete Candidate" },
  ];

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
              onButtonClick={() => {
                setEditCandidate(null);
                setIsModalOpen(true);
              }}
              customActions={customTableActions}
              mobileCardConfig={{
                titleField: "fullName",
                subtitleField: "position",
                statusField: "status",
                initialVisibleFields: ["email", "phone", "experience"],
              }}
            />
          )}
        </div>
      </div>
      <AddCandidateModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditCandidate(null);
        }}
        onSubmit={(data) => handleAddCandidate(data, editCandidate?.id)}
        editData={editCandidate}
      />
    </div>
  );
};

export default CandidatesPage;
