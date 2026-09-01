import axios from 'axios';
import { API_URL as BASE_API_URL } from './apiClient';

const API_URL = `${BASE_API_URL}/reports`;

export const getReports = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};
