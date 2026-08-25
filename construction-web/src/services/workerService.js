import axios from 'axios';

const API_URL = 'http://localhost:5000/api/worker';

export const getDashboardStats = async () => {
  const response = await axios.get(`${API_URL}/dashboard`);
  return response.data;
};

export const getTasks = async () => {
  const response = await axios.get(`${API_URL}/tasks`);
  return response.data;
};

export const updateTaskStatus = async (taskId, data) => {
  const response = await axios.patch(`${API_URL}/tasks/${taskId}`, data);
  return response.data;
};

export const getAttendance = async () => {
  const response = await axios.get(`${API_URL}/attendance`);
  return response.data;
};

export const acceptAttendanceTiming = async (attendanceId) => {
  const response = await axios.post(`${API_URL}/attendance/${attendanceId}/accept`);
  return response.data;
};

export const submitAbsenceReason = async (attendanceId, reason) => {
  const response = await axios.post(`${API_URL}/attendance/${attendanceId}/absence-reason`, { reason });
  return response.data;
};

export const clockIn = async (data) => {
  const response = await axios.post(`${API_URL}/attendance/clock-in`, data);
  return response.data;
};

export const clockOut = async (data = {}) => {
  const response = await axios.post(`${API_URL}/attendance/clock-out`, data);
  return response.data;
};

export const getAnnouncements = async () => {
  const response = await axios.get(`${API_URL}/announcements`);
  return response.data;
};

export const getProfile = async () => {
  const response = await axios.get(`${API_URL}/profile`);
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await axios.put(`${API_URL}/profile`, data);
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

export const createProgress = async (data) => {
  const response = await axios.post(`${API_URL}/progress`, data);
  return response.data;
};

export const getInvitations = async () => {
  const response = await axios.get(`${API_URL}/invitations`);
  return response.data;
};

export const respondToInvitation = async (invitationId, action) => {
  const response = await axios.post(`${API_URL}/invitations/${invitationId}/respond`, { action });
  return response.data;
};
