import React, { useState, useEffect, useCallback } from "react";
import Table from "../components/Table";
import Sidebar from "../components/Sidebar";
import { getAllEmployees, deleteEmployee, updateEmployee } from "../api/employeeAPI";
import { toast } from "react-hot-toast";
import SkeletonLoader from "../components/Loader";
import EditEmployeeModal from "../components/EmployeeModal";

const columns = [
  { key: "profile", label: "Profile", sortable: false },
  { key: "fullName", label: "Employee Name", sortable: true },
  { key: "email", label: "Email Address", sortable: true },
  { key: "phone", label: "Phone Number", sortable: false },
  { key: "position", label: "Position", sortable: true },
  { key: "department", label: "Department", sortable: true },
  { key: "joiningDate", label: "Date of Joining", sortable: true },
];

const filterOptions = [
  { value: "Intern", label: "Intern" },
  { value: "Junior", label: "Junior" },
  { value: "Senior", label: "Senior" },
  { value: "Team Lead", label: "Team Lead" },
  { value: "Designer", label: "Designer" },
];

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);


  

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllEmployees();

      if (!response || !response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid API response format");
      }

      const formattedEmployees = response.data.map((employee, index) => ({
        id: employee._id,
        srNo: (index + 1).toString().padStart(2, "0"),
        fullName: employee.fullName,
        email: employee.email,
        phone: employee.phone,
        position: employee.position,
        department: employee.department,
        dateOfJoining: employee.dateOfJoining,
        joiningDate: formatDate(employee.dateOfJoining),
        experience: employee.experience,
        profileImage: employee.profileImage || "", 
        candidateId: employee.candidateId,
        salary: employee.salary
      }));

      setEmployees(formattedEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error(error.message || "Failed to load employees");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-In', { 
      day: '2-digit', 
      month: '2-digit', 
      year: '2-digit' 
    });
  };

  const handleEditEmployee = (employee) => {
    setEditEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await deleteEmployee(id);
        toast.success("Employee deleted successfully");
        fetchEmployees();
      } catch (error) {
        console.error("Error deleting employee:", error);
        toast.error("Failed to delete employee");
      }
    }
  };

  const handleUpdateEmployee = async (formData, employeeId) => {

    if (
          !formData.get("fullName") ||
          !formData.get("email") ||
          !formData.get("phone")
        ) {
          toast.error("Please fill in all required fields.");
          return;
        }

        // TODO: complete this add more checks
    try {
      setIsModalOpen(false);

      if(employeeId){
        toast.loading("Updating employee...");
        await updateEmployee(employeeId, formData);
        toast.dismiss();
        toast.success("Employee updated successfully");
      }

      setEditEmployee(null);
      await fetchEmployees();
    } catch (error) {
      toast.dismiss();
      console.error("Error updating employee:", error);
      toast.error(error.message || "Failed to update employee");
    }
  };

  const handleRowAction = (row, action) => {
    if (action === "delete") {
      handleDeleteEmployee(row.id);
    } else if (action === "edit") {
      handleEditEmployee(row);
    }
  };

  const customTableActions = [
    { type: "edit", label: "Edit Employee" },
    { type: "delete", label: "Delete Employee" },
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
              title="Employees"
              columns={columns}
              data={employees}
              onRowAction={handleRowAction}
              filterOptions={filterOptions}
              searchPlaceholder="Search employees..."
              showProfileImages={true}
              loading={loading}
              customActions={customTableActions}
            />
          )}
        </div>
      </div>
      {isModalOpen && (
        <EditEmployeeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditEmployee(null);
        }}
        onSubmit={(employeeData) => handleUpdateEmployee(employeeData, editEmployee?.id)}
        editData={editEmployee} 
      />
      )}
    </div>
  );
};

export default EmployeesPage;