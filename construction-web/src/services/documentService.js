import axios from 'axios';
import { API_URL as BASE_API_URL } from './apiClient';

const API_URL = `${BASE_API_URL}/documents`;

export const getDocuments = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getHomeownerDocuments = async (projectId) => {
  const response = await axios.get(`${BASE_API_URL}/homeowner/projects/${projectId}/documents`);
  return response.data;
};
