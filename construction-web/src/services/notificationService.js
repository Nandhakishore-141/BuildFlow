import axios from 'axios';

export const getNotifications = async (role = 'homeowner') => {
  const roleLower = role.toLowerCase();
  const endpoint = roleLower === 'homeowner' ? '/homeowner/notifications' : roleLower === 'worker' ? '/worker/notifications' : '/contractor/notifications';
  const response = await axios.get(`http://localhost:5000/api${endpoint}`);
  return response.data;
};

export const markNotificationRead = async (id, role = 'homeowner') => {
  const roleLower = role.toLowerCase();
  const endpoint = roleLower === 'homeowner' ? `/homeowner/notifications/${id}/read` : roleLower === 'worker' ? `/worker/notifications/${id}/read` : `/contractor/notifications/${id}/read`;
  const response = await axios.put(`http://localhost:5000/api${endpoint}`);
  return response.data;
};
