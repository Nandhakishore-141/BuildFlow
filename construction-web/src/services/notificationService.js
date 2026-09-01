import axios from 'axios';
import { API_URL } from './apiClient';

export const getNotifications = async (role = 'homeowner') => {
  const roleLower = role.toLowerCase();
  const endpoint = roleLower === 'homeowner' ? '/homeowner/notifications' : roleLower === 'worker' ? '/worker/notifications' : '/contractor/notifications';
  const response = await axios.get(`${API_URL}${endpoint}`);
  return response.data;
};

export const markNotificationRead = async (id, role = 'homeowner') => {
  const roleLower = role.toLowerCase();
  const endpoint = roleLower === 'homeowner' ? `/homeowner/notifications/${id}/read` : roleLower === 'worker' ? `/worker/notifications/${id}/read` : `/contractor/notifications/${id}/read`;
  const response = await axios.put(`${API_URL}${endpoint}`);
  return response.data;
};
