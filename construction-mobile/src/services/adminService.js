import apiClient from './apiClient';

export const getDashboard = () => apiClient.get('/admin/dashboard');
export const getAnalytics = () => apiClient.get('/admin/analytics');
export const getUsers = (params) => apiClient.get('/admin/users', { params });
export const getContractors = () => apiClient.get('/admin/contractors');
export const getHomeowners = () => apiClient.get('/admin/homeowners');
export const getWorkers = () => apiClient.get('/admin/workers');
export const getProjects = (params) => apiClient.get('/admin/projects', { params });
export const getReports = () => apiClient.get('/admin/reports');
export const getAnnouncements = () => apiClient.get('/admin/announcements');
export const createAnnouncement = (data) => apiClient.post('/admin/announcements', data);
export const deleteAnnouncement = (id) => apiClient.delete(`/admin/announcements/${id}`);
export const getAuditLogs = (params) => apiClient.get('/admin/audit-logs', { params });
export const getNotifications = () => apiClient.get('/admin/notifications');
export const updateUserStatus = (id, status) => apiClient.patch(`/admin/users/${id}/status`, { status });
export const deleteUser = (id) => apiClient.delete(`/admin/users/${id}`);
export const approveProject = (id) => apiClient.patch(`/admin/projects/${id}/approve`);
export const impersonate = (id) => apiClient.post(`/admin/impersonate/${id}`);
