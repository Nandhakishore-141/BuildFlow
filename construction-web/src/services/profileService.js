import axios from 'axios';

const API_URL = 'http://localhost:5000/api/profile';

export const getProfile = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await axios.put(API_URL, data);
  return response.data;
};
