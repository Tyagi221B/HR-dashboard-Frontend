import axios from "./axiosInstance";

export const addCandidate = async (candidateData) => {

  const { data } = await axios.post("/candidate", candidateData, {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
  
  return data;
};

export const updateCandidate = async (id, updatedData) => {
  try {
    const { data } = await axios.put(
      `/candidate/update/${id}`,
      updatedData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
    );
    return data;
  } catch (error) {
    console.error(`Error updating candidate :`, error.response?.data || error.message);
    throw error;
  }
};

export const getAllCandidates = async () => {
  const { data } = await axios.get("/candidate/getall", { withCredentials: true });
  return data;
};

export const getResume = async (id) => {
  const { data } = await axios.get(`/candidate/resume/${id}`, { withCredentials: true });
  return data;
};

export const deleteCandidate = async (id) => {
  const { data } = await axios.delete(`/candidate/delete/${id}`, { withCredentials: true });
  return data;
};

export const updateCandidateStatus = async (id, status) => {
  try {
    const { data } = await axios.put(
      `/candidate/status/${id}`,
      { status },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json', // Explicitly setting JSON type
        }
      }
    );
    return data;
  } catch (error) {
    console.error(`Error updating candidate ${id} status:`, error.response?.data || error.message);
    throw error;
  }
};

