import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getDashboardStats = async (role = 'homeowner') => {
  const endpoint = role.toLowerCase() === 'contractor' ? '/contractor/dashboard' : role.toLowerCase() === 'worker' ? '/worker/dashboard' : '/homeowner/dashboard';
  const response = await axios.get(`${API_URL}${endpoint}`);
  return response.data;
};
