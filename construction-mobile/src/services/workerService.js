import apiClient from './apiClient';

export const getDashboardStats = () => apiClient.get('/worker/dashboard');
export const getTasks = () => apiClient.get('/worker/tasks');
export const updateTaskStatus = (id, data) => apiClient.patch(`/worker/tasks/${id}/status`, data);
export const getAttendance = () => apiClient.get('/worker/attendance');
export const acceptAttendanceTiming = (id) => apiClient.patch(`/worker/attendance/${id}/accept-timing`);
export const submitAbsenceReason = (id, data) => apiClient.post(`/worker/attendance/${id}/absence-reason`, data);
export const checkIn = (data) => apiClient.post('/worker/attendance/check-in', data);
export const checkOut = (data) => apiClient.post('/worker/attendance/check-out', data);
export const getInvitations = () => apiClient.get('/worker/invitations');
export const respondToInvitation = (id, action) => apiClient.post(`/worker/invitations/${id}/respond`, { action });
export const getAnnouncements = () => apiClient.get('/worker/announcements');
export const getProfile = () => apiClient.get('/worker/profile');
export const updateProfile = (data) => apiClient.put('/worker/profile', data);
export const getNotifications = () => apiClient.get('/worker/notifications');
export const createProgress = (data) => apiClient.post('/worker/progress', data);
