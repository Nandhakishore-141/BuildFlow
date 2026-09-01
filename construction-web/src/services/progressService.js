import axios from 'axios';
import { API_URL as BASE_API_URL } from './apiClient';

const API_URL = `${BASE_API_URL}/worker/progress`;

export const getProgress = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createProgress = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const getHomeownerProgress = async (projectId) => {
  const response = await axios.get(`${BASE_API_URL}/homeowner/projects/${projectId}/progress`);
  return response.data;
};
