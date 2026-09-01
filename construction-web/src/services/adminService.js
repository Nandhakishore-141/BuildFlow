import axios from 'axios';
import { API_URL as BASE_API_URL } from './apiClient';

const API_URL = `${BASE_API_URL}/admin`;

export const getDashboard = async () => {
  const response = await axios.get(`${API_URL}/dashboard`);
  return response.data;
};

export const getUsers = async (params = {}) => {
  const response = await axios.get(`${API_URL}/users`, { params });
  return response.data;
};

export const getProjects = async (params = {}) => {
  const response = await axios.get(`${API_URL}/projects`, { params });
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

export const getAuditLogs = async (params = {}) => {
  const response = await axios.get(`${API_URL}/audit-logs`, { params });
  return response.data;
};

export const getNotifications = async () => {
  const response = await axios.get(`${API_URL}/notifications`);
  return response.data;
};

export const markNotificationRead = async (id) => {
  const response = await axios.put(`${API_URL}/notifications/${id}/read`);
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

export const impersonateUser = async (userId) => {
  const response = await axios.post(`${API_URL}/impersonate/${userId}`);
  return response.data;
};

export const stopImpersonation = async () => {
  const response = await axios.post(`${API_URL}/stop-impersonation`);
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
