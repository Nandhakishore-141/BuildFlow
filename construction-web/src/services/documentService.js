import axios from 'axios';

const API_URL = 'http://localhost:5000/api/documents';

export const getDocuments = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getHomeownerDocuments = async (projectId) => {
  const response = await axios.get(`http://localhost:5000/api/homeowner/projects/${projectId}/documents`);
  return response.data;
};
