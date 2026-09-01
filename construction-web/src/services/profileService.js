import axios from 'axios';
import { API_URL as BASE_API_URL } from './apiClient';

const API_URL = `${BASE_API_URL}/profile`;

export const getProfile = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await axios.put(API_URL, data);
  return response.data;
};
