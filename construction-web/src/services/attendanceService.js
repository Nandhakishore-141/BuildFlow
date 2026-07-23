import axios from 'axios';

const API_URL = 'http://localhost:5000/api/attendance';

export const getAttendance = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};
