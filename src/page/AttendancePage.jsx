import React, { useState, useEffect, useCallback } from "react";
import Table from "../components/Table";
import Sidebar from "../components/Sidebar";
import {
  getAllEmployees,
  markAttendance,
  getEmployeeAttendance,
} from "../api/employeeAPI";
import { toast } from "react-hot-toast";
import SkeletonLoader from "../components/Loader";

const AttendancePage = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { key: "profile", label: "Profile", sortable: false },
    { key: "name", label: "Employee Name", sortable: true },
    { key: "position", label: "Position", sortable: true },
    { key: "department", label: "Department", sortable: true },
    { key: "task", label: "Task", sortable: true },
    { key: "status", label: "Status", sortable: true },
  ];

  const filterOptions = [
    { value: "Present", label: "Present" },
    { value: "Absent", label: "Absent" },
  ];

  const statusOptions = ["Present", "Absent"];

  const fetchEmployeesWithAttendance = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllEmployees();
      if (!response || !response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid API response format");
      }

      const employeeList = response.data;
      const today = new Date().toISOString().split("T")[0];

      const attendancePromises = employeeList.map(async (employee) => {
        try {
          const attendanceResponse = await getEmployeeAttendance(employee._id);
          console.log(`Attendance for ${employee.fullName}:`, attendanceResponse?.data);
          
          const todayAttendance = attendanceResponse?.data?.find((record) => {
            const recordDate = new Date(record.date);
            const localDate = new Date(recordDate.getTime() - recordDate.getTimezoneOffset() * 60000)
              .toISOString()
              .split("T")[0];
            return localDate === today;
          });

          return {
            id: employee._id,
            name: employee.fullName,
            position: employee.position || "Not specified",
            department: employee.department || "Not specified",
            task: todayAttendance?.task || "--",
            status: todayAttendance?.status || "Absent",
            profileImage: employee.profileImage || "",
          };
        } catch (error) {
          console.log(error);
          return {
            id: employee._id,
            name: employee.fullName,
            position: employee.position || "Not specified",
            department: employee.department || "Not specified",
            task: "--",
            status: "Absent",
            profileImage: employee.profileImage || "",
          };
        }
      });

      const attendanceResults = await Promise.all(attendancePromises);
      console.log("Final Processed Attendance Data:", attendanceResults);
      setAttendanceData(attendanceResults);
    } catch (error) {
      toast.error(error.message || "Failed to load employee data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployeesWithAttendance();
  }, [fetchEmployeesWithAttendance]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const employee = attendanceData.find((emp) => emp.id === id);
      if (!employee) {
        throw new Error("Employee not found");
      }

      const today = new Date().toISOString().split("T")[0];
      const attendancePayload = {
        date: today,
        status: newStatus,
        task: employee.task !== "--" ? employee.task : "",
      };

      await markAttendance(id, attendancePayload);
      toast.success(`Status updated to ${newStatus}`);

      setTimeout(() => {
        fetchEmployeesWithAttendance();
      }, 300);
    } catch (error) {
      console.error("Error updating attendance status:", error);
      toast.error("Failed to update attendance status");
      fetchEmployeesWithAttendance();
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
              title="Attendance"
              columns={columns}
              data={attendanceData}
              onStatusChange={handleStatusChange}
              filterOptions={filterOptions}
              statusOptions={statusOptions}
              searchPlaceholder="Search employees..."
              showProfileImages={true}
              loading={loading}
              mobileCardConfig={{
                titleField: "name", 
                subtitleField: "position",  
                statusField: "status",
                initialVisibleFields: ["department", "task"] 
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
