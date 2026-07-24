import axios from 'axios';

const API_URL = 'http://localhost:5000/api/notifications';

export const getNotifications = async (role = 'homeowner') => {
  const endpoint = role.toLowerCase() === 'homeowner' ? '/homeowner/notifications' : '/notifications';
  const response = await axios.get(`http://localhost:5000/api${endpoint}`);
  return response.data;
};

export const markNotificationRead = async (id, role = 'homeowner') => {
  const endpoint = role.toLowerCase() === 'homeowner' ? `/homeowner/notifications/${id}/read` : `/notifications/${id}/read`;
  const response = await axios.put(`http://localhost:5000/api${endpoint}`);
  return response.data;
};
