import axios from 'axios';

const API_URL = 'http://localhost:5000/api/worker/attendance';

export const getAttendance = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const clockIn = async (data) => {
  const response = await axios.post(`${API_URL}/clock-in`, data);
  return response.data;
};

export const clockOut = async (data = {}) => {
  const response = await axios.post(`${API_URL}/clock-out`, data);
  return response.data;
};
