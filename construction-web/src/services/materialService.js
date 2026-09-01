import axios from 'axios';
import { API_URL as BASE_API_URL } from './apiClient';

const API_URL = `${BASE_API_URL}/materials`;

export const getMaterials = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};
