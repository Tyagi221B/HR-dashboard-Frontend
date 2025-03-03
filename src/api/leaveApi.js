import axiosInstance from "./axiosInstance";


export const getLeaves = async () => {
  try {
    const { data } = await axiosInstance.get("/leaves/getall", { withCredentials: true });
    return data;
  } catch (error) {
    console.error("Error fetching leaves:", error.response?.data || error.message);
    throw error;
  }
};


export const getActiveEmployees = async () => {
  try {
    const { data } = await axiosInstance.get("/employees/getall", { withCredentials: true });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching active employees:", error.response?.data || error.message);
    throw error;
  }
};


export const getEmployeeLeave = async (id) => {
  try {
    const { data } = await axiosInstance.get(`/leaves/employee/${id}`, { withCredentials: true });
    return data;
  } catch (error) {
    console.error("Error fetching employee leaves:", error.response?.data || error.message);
    throw error;
  }
};


export const getLeaveById = async (id) => {
  try {
    const { data } = await axiosInstance.get(`/api/v1/leaves/${id}`, { withCredentials: true });
    return data;
  } catch (error) {
    console.error(`Error fetching leave ${id}:`, error.response?.data || error.message);
    throw error;
  }
};


export const addLeave = async (formData) => {
  try {
    const { data } = await axiosInstance.post("/leaves/add", formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    console.error("Error adding leave:", error.response?.data || error.message);
    throw error;
  }
};

export const updateLeaveStatus = async (id, status) => {
  try {
    const { data } = await axiosInstance.patch(
      `/leaves/${id}/status`,
      { status },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data;
  } catch (error) {
    console.error(`Error updating leave status for ${id}:`, error.response?.data || error.message);
    throw error;
  }
};


export const deleteLeaveById = async (id) => {
  try {
    const { data } = await axiosInstance.delete(`/leaves/${id}`, { withCredentials: true });
    return data;
  } catch (error) {
    console.error(`Error deleting leave ${id}:`, error.response?.data || error.message);
    throw error;
  }
};


export const downloadDocument = (documentId) => {
  if (!documentId) return null;
  return `${import.meta.env.VITE_API_BASE_URL}/api/v1/upload/document/${documentId}`;
};


export const handleDocumentDownload = async (documentId) => {
  if (!documentId) {
    throw new Error("No document ID provided");
  }
  
  try {
    window.open(downloadDocument(documentId), '_blank');
  } catch (error) {
    console.error("Error downloading document:", error);
    throw error;
  }
};