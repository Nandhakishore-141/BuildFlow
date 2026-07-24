import axios from 'axios';

const API_URL = 'http://localhost:5000/api/progress';

export const getProgress = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createProgress = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const getHomeownerProgress = async (projectId) => {
  const response = await axios.get(`http://localhost:5000/api/homeowner/projects/${projectId}/progress`);
  return response.data;
};
