import axiosInstance from "./axiosInstance";


export const getAllEmployees = async () => {
  try {
    const response = await axiosInstance.get("/employees/getall");
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

export const getEmployeeById = async (id) => {
  try {
    const response = await axiosInstance.get(`/employees/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching employee with ID ${id}:`, error);
    throw error;
  }
};


export const updateEmployee = async (id, updatedData) => {
  try {
    const {data} = await axiosInstance.put(`/employees/update/${id}`, updatedData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
    );
    
    return data;
  } catch (error) {
    console.error(`Error updating employee with ID ${id}:`, error);
    throw error;
  }
};

export const deleteEmployee = async (id) => {
  try {
    const response = await axiosInstance.delete(`/employees/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting employee with ID ${id}:`, error);
    throw error;
  }
};


export const markAttendance = async (id, attendanceData) => {
  try {
    const response = await axiosInstance.post(`/employees/${id}/attendance`, attendanceData);
    return response.data;
  } catch (error) {
    console.error(`Error marking attendance for employee ID ${id}:`, error);
    throw error;
  }
};


export const getEmployeeAttendance = async (id, params = {}) => {
  try {
    const response = await axiosInstance.get(`/employees/${id}/attendance`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching attendance for employee ID ${id}:`, error);
    throw error;
  }
};