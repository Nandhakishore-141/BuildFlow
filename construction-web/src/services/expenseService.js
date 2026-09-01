import axios from 'axios';
import { API_URL as BASE_API_URL } from './apiClient';

const API_URL = `${BASE_API_URL}/expenses`;

export const getExpenses = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getHomeownerExpenses = async (projectId) => {
  const response = await axios.get(`${BASE_API_URL}/homeowner/projects/${projectId}/expenses`);
  return response.data;
};
