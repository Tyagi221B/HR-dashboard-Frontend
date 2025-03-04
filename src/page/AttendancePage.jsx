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
  const LOCAL_STORAGE_KEY = "employeeAttendanceData";

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

  useEffect(() => {
    if (attendanceData.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(attendanceData));
      localStorage.setItem(
        LOCAL_STORAGE_KEY + "_date",
        new Date().toISOString().split("T")[0]
      );
    }
  }, [attendanceData]);

  const fetchEmployeesWithAttendance = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllEmployees();

      if (!response || !response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid API response format");
      }

      const employeeList = response.data;

      const today = new Date().toISOString().split("T")[0];
      console.log("Today's date for comparison:", today);

      const attendancePromises = employeeList.map(async (employee) => {
        try {
          const attendanceResponse = await getEmployeeAttendance(employee._id);

          if (!attendanceResponse || !attendanceResponse.data) {
            throw new Error("Invalid attendance data format");
          }

          console.log(
            `Attendance data for ${employee.fullName}:`,
            attendanceResponse.data
          );

          const todayAttendance = attendanceResponse.data.find((record) => {
            let recordDate;
            try {
              recordDate = new Date(record.date).toISOString().split("T")[0];
            } catch (error) {
              console.error("Error parsing date:", record.date);
              console.error(error);
              return false;
            }
            return recordDate === today;
          });

          if (todayAttendance) {
            console.log(
              `Found today's attendance for ${employee.fullName}:`,
              todayAttendance
            );
          } else {
            console.log(
              `No attendance record found for ${employee.fullName} today`
            );
          }

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
          console.error(
            `Error fetching attendance for ${employee.fullName}:`,
            error
          );
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
      setAttendanceData(attendanceResults);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error(error.message || "Failed to load employee data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedAttendanceData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedAttendanceData) {
      try {
        const parsedData = JSON.parse(savedAttendanceData);

        const today = new Date().toISOString().split("T")[0];
        const savedDate = localStorage.getItem(LOCAL_STORAGE_KEY + "_date");

        if (savedDate === today) {
          console.log("Loading attendance data from localStorage");
          setAttendanceData(parsedData);
          setLoading(false);
        } else {
          console.log("Saved data is not from today, fetching fresh data");
          fetchEmployeesWithAttendance();
        }
      } catch (error) {
        console.error("Error parsing saved attendance data:", error);
        fetchEmployeesWithAttendance();
      }
    } else {
      fetchEmployeesWithAttendance();
    }
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

      setAttendanceData((prev) =>
        prev.map((emp) => (emp.id === id ? { ...emp, status: newStatus } : emp))
      );

      await markAttendance(id, attendancePayload);
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating attendance status:", error);
      toast.error("Failed to update attendance status");

      fetchEmployeesWithAttendance();
    }
  };

  const handleTaskUpdate = async (id, task) => {
    try {
      const employee = attendanceData.find((emp) => emp.id === id);
      if (!employee) {
        throw new Error("Employee not found");
      }

      const today = new Date().toISOString().split("T")[0];
      const attendancePayload = {
        date: today,
        status: employee.status,
        task: task,
      };

      setAttendanceData((prev) =>
        prev.map((emp) => (emp.id === id ? { ...emp, task: task } : emp))
      );

      await markAttendance(id, attendancePayload);
      toast.success("Task updated successfully");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");

      fetchEmployeesWithAttendance();
    }
  };

  const handleRowAction = (row, action) => {
    if (action === "editTask") {
      const newTask = prompt(
        "Enter task for today:",
        row.task === "--" ? "" : row.task
      );
      if (newTask !== null) {
        handleTaskUpdate(row.id, newTask || "");
      }
    }
  };

  const customTableActions = [{ type: "editTask", label: "Edit Task" }];

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
            <>
              <Table
                title="Attendance"
                columns={columns}
                data={attendanceData}
                onRowAction={handleRowAction}
                onStatusChange={handleStatusChange}
                filterOptions={filterOptions}
                statusOptions={statusOptions}
                searchPlaceholder="Search employees..."
                showProfileImages={true}
                loading={loading}
                customActions={customTableActions}
                mobileCardConfig={{
                  titleField: "name", 
                  subtitleField: "position",  
                  statusField: "status",
                  initialVisibleFields: ["department", "task"] 
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
