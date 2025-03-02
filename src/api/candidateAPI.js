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

export const getAllCandidates = async () => {
  const { data } = await axios.get("/candidate/getall", { withCredentials: true });
  return data;
};

export const deleteCandidate = async (id) => {
  const { data } = await axios.delete(`/candidate/delete/${id}`, { withCredentials: true });
  return data;
};

export const updateCandidateStatus = async (id, status) => {
  const { data } = await axios.put(`/candidate/status/${id}`, { status }, { withCredentials: true });
  return data;
};