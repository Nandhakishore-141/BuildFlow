import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

export const getDashboard = async () => {
  const response = await axios.get(`${API_URL}/dashboard`);
  return response.data;
};

export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

export const getProjects = async () => {
  const response = await axios.get(`${API_URL}/projects`);
  return response.data;
};

export const getReports = async () => {
  const response = await axios.get(`${API_URL}/reports`);
  return response.data;
};

export const getAnalytics = async () => {
  const response = await axios.get(`${API_URL}/analytics`);
  return response.data;
};

export const getAuditLogs = async () => {
  const response = await axios.get(`${API_URL}/audit-logs`);
  return response.data;
};

export const getAnnouncements = async () => {
  const response = await axios.get(`${API_URL}/announcements`);
  return response.data;
};

export const createAnnouncement = async (data) => {
  const response = await axios.post(`${API_URL}/announcements`, data);
  return response.data;
};

export const updateUserStatus = async (id, status) => {
  const response = await axios.patch(`${API_URL}/users/${id}/status`, { status });
  return response.data;
};

export const verifyContractor = async (id) => {
  const response = await axios.patch(`${API_URL}/contractors/${id}/verify`);
  return response.data;
};
